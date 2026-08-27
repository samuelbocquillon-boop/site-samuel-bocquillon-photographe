#!/usr/bin/env python3
"""
Backend API tests for Gallery feature (Samuel Bocquillon photography site)
Tests all CRUD operations for the unified gallery system.
"""
import requests
import sys
import json
from datetime import datetime

BASE_URL = "https://wedding-samuel.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "SamuelB2025!"

class GalleryAPITester:
    def __init__(self):
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_items = []  # Track items we create for cleanup
        
    def log(self, msg, status="info"):
        prefix = {
            "info": "ℹ️",
            "success": "✅",
            "error": "❌",
            "warning": "⚠️"
        }.get(status, "•")
        print(f"{prefix} {msg}")
    
    def test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{BASE_URL}/{endpoint}"
        h = {'Content-Type': 'application/json'}
        if self.token:
            h['Authorization'] = f'Bearer {self.token}'
        if headers:
            h.update(headers)
        
        self.tests_run += 1
        self.log(f"Testing {name}...", "info")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=h, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=h, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=h, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=h, timeout=10)
            else:
                self.log(f"Unknown method {method}", "error")
                return False, {}
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"PASSED - Status: {response.status_code}", "success")
            else:
                self.log(f"FAILED - Expected {expected_status}, got {response.status_code}", "error")
                try:
                    self.log(f"Response: {response.text[:200]}", "error")
                except:
                    pass
            
            try:
                return success, response.json() if response.text else {}
            except:
                return success, {}
        
        except Exception as e:
            self.log(f"FAILED - Error: {str(e)}", "error")
            return False, {}
    
    def login(self):
        """Test login and get admin token"""
        self.log("=== AUTHENTICATION ===", "info")
        success, response = self.test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log("Admin token obtained", "success")
            return True
        self.log("Login failed - cannot proceed with admin tests", "error")
        return False
    
    def test_public_gallery_get(self):
        """Test GET /api/gallery (public) - should return 12 seeded items"""
        self.log("\n=== PUBLIC GALLERY GET ===", "info")
        success, response = self.test(
            "GET /api/gallery (public)",
            "GET",
            "gallery",
            200
        )
        
        if not success:
            return False
        
        # Validate response structure
        if 'items' not in response:
            self.log("Response missing 'items' key", "error")
            return False
        
        items = response['items']
        self.log(f"Gallery has {len(items)} items", "info")
        
        # Should have 12 seed items initially
        if len(items) != 12:
            self.log(f"Expected 12 seed items, got {len(items)}", "warning")
        
        # Validate each item structure
        required_fields = ['id', 'url', 'alt', 'order', 'src', 'full']
        for i, item in enumerate(items[:3]):  # Check first 3 items
            self.log(f"Validating item {i+1}...", "info")
            for field in required_fields:
                if field not in item:
                    self.log(f"Item {i+1} missing required field: {field}", "error")
                    return False
            
            # Check alt is non-empty
            if not item['alt'] or not item['alt'].strip():
                self.log(f"Item {i+1} has empty alt text", "error")
                return False
            
            # Check srcset (should be null for non-Cloudinary URLs like unsplash)
            if 'srcset' not in item:
                self.log(f"Item {i+1} missing 'srcset' field", "error")
                return False
            
            self.log(f"Item {i+1}: id={item['id'][:8]}..., alt='{item['alt'][:40]}...', srcset={'present' if item['srcset'] else 'null'}", "info")
        
        self.log("Public gallery GET validation passed", "success")
        return True
    
    def test_gallery_post_cloudinary(self):
        """Test POST /api/gallery with Cloudinary URLs"""
        self.log("\n=== GALLERY POST (Cloudinary URLs) ===", "info")
        
        # Test with 2 Cloudinary URLs
        test_urls = [
            "https://res.cloudinary.com/demo/image/upload/v1/sample-1.jpg",
            "https://res.cloudinary.com/demo/image/upload/v1/sample-2.jpg"
        ]
        
        success, response = self.test(
            "POST /api/gallery (bulk add 2 Cloudinary URLs)",
            "POST",
            "gallery",
            200,
            data={"urls": test_urls, "alt": ""}
        )
        
        if not success:
            return False
        
        # Validate response
        if 'created' not in response or 'count' not in response:
            self.log("Response missing 'created' or 'count' key", "error")
            return False
        
        if response['count'] != 2:
            self.log(f"Expected count=2, got {response['count']}", "error")
            return False
        
        created = response['created']
        if len(created) != 2:
            self.log(f"Expected 2 created items, got {len(created)}", "error")
            return False
        
        # Track created items for cleanup
        for item in created:
            self.created_items.append(item['id'])
            self.log(f"Created item: id={item['id'][:8]}..., order={item['order']}", "info")
            
            # Validate Cloudinary optimization
            if 'src' not in item or 'srcset' not in item or 'full' not in item:
                self.log("Created item missing optimization fields", "error")
                return False
            
            # Check src contains f_auto,q_auto,w_800
            if 'f_auto' not in item['src'] or 'q_auto' not in item['src'] or 'w_800' not in item['src']:
                self.log(f"src missing expected transformations: {item['src']}", "error")
                return False
            
            # Check srcset contains 400/800/1200w
            if not item['srcset'] or 'w_400' not in item['srcset'] or 'w_800' not in item['srcset'] or 'w_1200' not in item['srcset']:
                self.log(f"srcset missing expected widths: {item['srcset']}", "error")
                return False
            
            # Check full contains w_2000
            if 'w_2000' not in item['full'] or 'q_auto:good' not in item['full']:
                self.log(f"full missing expected transformations: {item['full']}", "error")
                return False
        
        self.log("Cloudinary URL optimization validated", "success")
        return True
    
    def test_gallery_post_normalization(self):
        """Test POST /api/gallery with Cloudinary URL that has existing transformations"""
        self.log("\n=== GALLERY POST (URL Normalization) ===", "info")
        
        # URL with existing transformations that should be stripped
        test_url = "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/v1/sample-3.jpg"
        
        success, response = self.test(
            "POST /api/gallery (URL with existing transformations)",
            "POST",
            "gallery",
            200,
            data={"urls": [test_url], "alt": "Test normalization"}
        )
        
        if not success:
            return False
        
        created = response.get('created', [])
        if len(created) != 1:
            self.log(f"Expected 1 created item, got {len(created)}", "error")
            return False
        
        item = created[0]
        self.created_items.append(item['id'])
        
        # The stored URL should have transformations removed
        # But the src/srcset/full should have NEW transformations applied
        self.log(f"Created item with normalized URL: {item['url'][:60]}...", "info")
        
        # Verify transformations are in the optimized versions
        if 'f_auto' not in item['src']:
            self.log("Normalization failed - src missing transformations", "error")
            return False
        
        self.log("URL normalization validated", "success")
        return True
    
    def test_gallery_post_invalid_url(self):
        """Test POST /api/gallery with invalid URL (should return 400)"""
        self.log("\n=== GALLERY POST (Invalid URL) ===", "info")
        
        success, response = self.test(
            "POST /api/gallery (invalid URL - no http)",
            "POST",
            "gallery",
            400,
            data={"urls": ["not-a-valid-url.jpg"], "alt": ""}
        )
        
        if success:
            self.log("Invalid URL correctly rejected with 400", "success")
            return True
        else:
            self.log("Invalid URL should return 400", "error")
            return False
    
    def test_gallery_post_no_token(self):
        """Test POST /api/gallery without token (should return 401/403)"""
        self.log("\n=== GALLERY POST (No Auth) ===", "info")
        
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        
        success, response = self.test(
            "POST /api/gallery (no token)",
            "POST",
            "gallery",
            403,  # FastAPI HTTPBearer returns 403
            data={"urls": ["https://example.com/test.jpg"], "alt": ""}
        )
        
        # Restore token
        self.token = temp_token
        
        if success:
            self.log("Unauthorized request correctly rejected", "success")
            return True
        else:
            self.log("Unauthorized request should return 401/403", "error")
            return False
    
    def test_gallery_reorder(self):
        """Test PUT /api/gallery/reorder"""
        self.log("\n=== GALLERY REORDER ===", "info")
        
        # First, get current gallery
        success, response = self.test(
            "GET /api/gallery (before reorder)",
            "GET",
            "gallery",
            200
        )
        
        if not success:
            return False
        
        items = response.get('items', [])
        if len(items) < 2:
            self.log("Need at least 2 items to test reorder", "warning")
            return True
        
        # Reverse the order
        original_ids = [item['id'] for item in items]
        reversed_ids = list(reversed(original_ids))
        
        self.log(f"Reversing order of {len(original_ids)} items", "info")
        
        success, response = self.test(
            "PUT /api/gallery/reorder",
            "PUT",
            "gallery/reorder",
            200,
            data={"ids": reversed_ids}
        )
        
        if not success:
            return False
        
        # Verify new order
        success, response = self.test(
            "GET /api/gallery (after reorder)",
            "GET",
            "gallery",
            200
        )
        
        if not success:
            return False
        
        new_items = response.get('items', [])
        new_ids = [item['id'] for item in new_items]
        
        if new_ids == reversed_ids:
            self.log("Reorder successful - order matches", "success")
            
            # Restore original order
            self.test(
                "PUT /api/gallery/reorder (restore original)",
                "PUT",
                "gallery/reorder",
                200,
                data={"ids": original_ids}
            )
            return True
        else:
            self.log("Reorder failed - order does not match", "error")
            return False
    
    def test_gallery_update_alt(self):
        """Test PUT /api/gallery/{id} to update alt text"""
        self.log("\n=== GALLERY UPDATE ALT ===", "info")
        
        if not self.created_items:
            self.log("No created items to test alt update", "warning")
            return True
        
        item_id = self.created_items[0]
        new_alt = "Updated alt text for testing"
        
        success, response = self.test(
            f"PUT /api/gallery/{item_id} (update alt)",
            "PUT",
            f"gallery/{item_id}",
            200,
            data={"alt": new_alt}
        )
        
        if not success:
            return False
        
        # Verify the update
        success, response = self.test(
            "GET /api/gallery (verify alt update)",
            "GET",
            "gallery",
            200
        )
        
        if not success:
            return False
        
        items = response.get('items', [])
        updated_item = next((item for item in items if item['id'] == item_id), None)
        
        if updated_item and updated_item['alt'] == new_alt:
            self.log("Alt text update successful", "success")
            return True
        else:
            self.log("Alt text update failed - not reflected in GET", "error")
            return False
    
    def test_gallery_update_unknown_id(self):
        """Test PUT /api/gallery/{id} with unknown id (should return 404)"""
        self.log("\n=== GALLERY UPDATE (Unknown ID) ===", "info")
        
        fake_id = "00000000-0000-0000-0000-000000000000"
        
        success, response = self.test(
            "PUT /api/gallery/{unknown_id} (should 404)",
            "PUT",
            f"gallery/{fake_id}",
            404,
            data={"alt": "test"}
        )
        
        if success:
            self.log("Unknown ID correctly returned 404", "success")
            return True
        else:
            self.log("Unknown ID should return 404", "error")
            return False
    
    def test_gallery_delete(self):
        """Test DELETE /api/gallery/{id}"""
        self.log("\n=== GALLERY DELETE ===", "info")
        
        if not self.created_items:
            self.log("No created items to test delete", "warning")
            return True
        
        item_id = self.created_items[0]
        
        success, response = self.test(
            f"DELETE /api/gallery/{item_id}",
            "DELETE",
            f"gallery/{item_id}",
            200
        )
        
        if not success:
            return False
        
        # Verify deletion
        success, response = self.test(
            "GET /api/gallery (verify deletion)",
            "GET",
            "gallery",
            200
        )
        
        if not success:
            return False
        
        items = response.get('items', [])
        deleted_item = next((item for item in items if item['id'] == item_id), None)
        
        if deleted_item is None:
            self.log("Item successfully deleted", "success")
            self.created_items.remove(item_id)
            return True
        else:
            self.log("Item still exists after delete", "error")
            return False
    
    def test_gallery_delete_unknown_id(self):
        """Test DELETE /api/gallery/{id} with unknown id (should return 404)"""
        self.log("\n=== GALLERY DELETE (Unknown ID) ===", "info")
        
        fake_id = "00000000-0000-0000-0000-000000000000"
        
        success, response = self.test(
            "DELETE /api/gallery/{unknown_id} (should 404)",
            "DELETE",
            f"gallery/{fake_id}",
            404
        )
        
        if success:
            self.log("Unknown ID correctly returned 404", "success")
            return True
        else:
            self.log("Unknown ID should return 404", "error")
            return False
    
    def cleanup_test_items(self):
        """Clean up all test items to restore gallery to 12 seed items"""
        self.log("\n=== CLEANUP TEST ITEMS ===", "info")
        
        if not self.created_items:
            self.log("No test items to clean up", "info")
            return True
        
        self.log(f"Cleaning up {len(self.created_items)} test items...", "info")
        
        for item_id in self.created_items[:]:
            success, _ = self.test(
                f"DELETE test item {item_id[:8]}...",
                "DELETE",
                f"gallery/{item_id}",
                200
            )
            if success:
                self.created_items.remove(item_id)
        
        # Verify final count
        success, response = self.test(
            "GET /api/gallery (verify cleanup)",
            "GET",
            "gallery",
            200
        )
        
        if success:
            final_count = len(response.get('items', []))
            if final_count == 12:
                self.log(f"Cleanup successful - gallery restored to 12 seed items", "success")
                return True
            else:
                self.log(f"Cleanup incomplete - gallery has {final_count} items (expected 12)", "warning")
                return False
        
        return False
    
    def run_all_tests(self):
        """Run all gallery API tests"""
        self.log("=" * 60, "info")
        self.log("GALLERY API TESTS - Samuel Bocquillon Photography Site", "info")
        self.log("=" * 60, "info")
        
        # Authentication
        if not self.login():
            self.log("\n❌ Cannot proceed without authentication", "error")
            return False
        
        # Public tests
        self.test_public_gallery_get()
        
        # Admin tests - POST
        self.test_gallery_post_cloudinary()
        self.test_gallery_post_normalization()
        self.test_gallery_post_invalid_url()
        self.test_gallery_post_no_token()
        
        # Admin tests - PUT
        self.test_gallery_reorder()
        self.test_gallery_update_alt()
        self.test_gallery_update_unknown_id()
        
        # Admin tests - DELETE
        self.test_gallery_delete()
        self.test_gallery_delete_unknown_id()
        
        # Cleanup
        self.cleanup_test_items()
        
        # Summary
        self.log("\n" + "=" * 60, "info")
        self.log(f"TESTS COMPLETED: {self.tests_passed}/{self.tests_run} passed", "info")
        self.log("=" * 60, "info")
        
        if self.tests_passed == self.tests_run:
            self.log("✅ ALL TESTS PASSED", "success")
            return True
        else:
            self.log(f"❌ {self.tests_run - self.tests_passed} TESTS FAILED", "error")
            return False

def main():
    tester = GalleryAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
