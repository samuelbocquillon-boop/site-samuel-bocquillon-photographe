"""
Backend API Tests for Samuel Bocquillon Photography Website
Tests all endpoints: auth, images, contact, settings, testimonials
"""
import requests
import sys
import json
from datetime import datetime

# Public endpoint from frontend/.env
BASE_URL = "https://wedding-samuel.preview.emergentagent.com/api"

class APITester:
    def __init__(self):
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.failures = []
        
    def log(self, emoji, message):
        print(f"{emoji} {message}")
    
    def test(self, name, method, endpoint, expected_status, data=None, json_data=None, files=None, auth=True):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        headers = {}
        
        if auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        if json_data:
            headers['Content-Type'] = 'application/json'
        
        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   {method} {endpoint}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                if files:
                    response = requests.post(url, headers=headers, data=data, files=files, timeout=30)
                elif json_data:
                    response = requests.post(url, headers=headers, json=json_data, timeout=10)
                else:
                    response = requests.post(url, headers=headers, data=data, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, headers=headers, json=json_data, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log("✅", f"PASS - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.tests_failed += 1
                self.log("❌", f"FAIL - Expected {expected_status}, got {response.status_code}")
                self.failures.append({
                    'test': name,
                    'endpoint': endpoint,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200] if response.text else ''
                })
                return False, {}
                
        except Exception as e:
            self.tests_failed += 1
            self.log("❌", f"FAIL - Error: {str(e)}")
            self.failures.append({
                'test': name,
                'endpoint': endpoint,
                'error': str(e)
            })
            return False, {}
    
    def print_summary(self):
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        print(f"Total tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failures:
            print("\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failures, 1):
                print(f"\n{i}. {failure.get('test', 'Unknown')}")
                print(f"   Endpoint: {failure.get('endpoint', 'N/A')}")
                if 'error' in failure:
                    print(f"   Error: {failure['error']}")
                else:
                    print(f"   Expected: {failure.get('expected', 'N/A')}, Got: {failure.get('actual', 'N/A')}")
                    if failure.get('response'):
                        print(f"   Response: {failure['response']}")
        
        return self.tests_failed == 0


def main():
    tester = APITester()
    
    print("="*60)
    print("🧪 SAMUEL BOCQUILLON API TESTS")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # ============================================================
    # 1. AUTH TESTS
    # ============================================================
    print("\n" + "="*60)
    print("🔐 AUTHENTICATION TESTS")
    print("="*60)
    
    # Test 1: Login with correct credentials
    success, data = tester.test(
        "Login with correct credentials (admin/SamuelB2025!)",
        "POST",
        "/auth/login",
        200,
        json_data={"username": "admin", "password": "SamuelB2025!"},
        auth=False
    )
    
    if success and 'access_token' in data:
        tester.token = data['access_token']
        tester.log("🔑", f"Token obtained: {tester.token[:20]}...")
    else:
        tester.log("⚠️", "Failed to obtain token - subsequent auth tests will fail")
    
    # Test 2: Login with wrong credentials
    tester.test(
        "Login with wrong credentials (should return 401)",
        "POST",
        "/auth/login",
        401,
        json_data={"username": "admin", "password": "wrongpassword"},
        auth=False
    )
    
    # Test 3: Get current user
    if tester.token:
        tester.test(
            "Get current authenticated user",
            "GET",
            "/auth/me",
            200,
            auth=True
        )
    
    # ============================================================
    # 2. IMAGES TESTS
    # ============================================================
    print("\n" + "="*60)
    print("🖼️  IMAGES TESTS")
    print("="*60)
    
    # Test 4: Get all images
    success, images_data = tester.test(
        "GET /images - List all image slots",
        "GET",
        "/images",
        200,
        auth=False
    )
    
    if success:
        slots_count = len(images_data.get('slots', []))
        pages_count = len(images_data.get('pages', []))
        tester.log("📋", f"Found {slots_count} slots across {pages_count} pages")
        
        # Verify expected counts
        if slots_count == 53:
            tester.log("✅", "Correct number of slots (53)")
        else:
            tester.log("⚠️", f"Expected 53 slots, found {slots_count}")
        
        if pages_count == 11:
            tester.log("✅", "Correct number of pages (11)")
        else:
            tester.log("⚠️", f"Expected 11 pages, found {pages_count}")
    
    # Test 5: Get specific image slot
    tester.test(
        "GET /images/{slot_key} - Get specific slot (accueil-hero)",
        "GET",
        "/images/accueil-hero",
        200,
        auth=False
    )
    
    # Test 6: Update alt text (requires auth)
    if tester.token:
        tester.test(
            "PUT /images/{slot_key}/alt - Update alt text (requires auth)",
            "PUT",
            "/images/accueil-hero/alt",
            200,
            json_data={"alt": "Test alt text updated"},
            auth=True
        )
    
    # Test 7: Upload image without auth (should fail)
    tester.test(
        "POST /images/upload - Upload without auth (should return 401/403)",
        "POST",
        "/images/upload",
        401,
        data={"slot_key": "accueil-hero", "alt": "Test"},
        auth=False
    )
    
    # Test 8: Delete image (requires auth)
    if tester.token:
        tester.test(
            "DELETE /images/{slot_key} - Reset to default (requires auth)",
            "DELETE",
            "/images/accueil-hero",
            200,
            auth=True
        )
    
    # ============================================================
    # 3. CONTACT TESTS
    # ============================================================
    print("\n" + "="*60)
    print("📧 CONTACT TESTS")
    print("="*60)
    
    # Test 9: Submit contact form
    contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "0612345678",
        "wedding_date": "2025-09-15",
        "wedding_location": "Valenciennes",
        "message": "Ceci est un message de test pour le formulaire de contact."
    }
    
    success, contact_response = tester.test(
        "POST /contact - Submit contact form",
        "POST",
        "/contact",
        200,
        json_data=contact_data,
        auth=False
    )
    
    contact_id = None
    if success:
        contact_id = contact_response.get('id')
        emailed = contact_response.get('emailed', None)
        tester.log("📬", f"Contact submitted with ID: {contact_id}")
        
        # Verify emailed is false (SMTP not configured)
        if emailed == False:
            tester.log("✅", "Correct: emailed=false (SMTP not configured as expected)")
        else:
            tester.log("⚠️", f"Expected emailed=false, got {emailed}")
    
    # Test 10: Get contacts (requires auth)
    if tester.token:
        success, contacts = tester.test(
            "GET /contacts - List all contacts (requires auth)",
            "GET",
            "/contacts",
            200,
            auth=True
        )
        
        if success and isinstance(contacts, list):
            tester.log("📋", f"Found {len(contacts)} contact submissions")
    
    # Test 11: Mark contact as read (requires auth)
    if tester.token and contact_id:
        tester.test(
            "PUT /contacts/{id}/read - Mark contact as read (requires auth)",
            "PUT",
            f"/contacts/{contact_id}/read",
            200,
            auth=True
        )
    
    # Test 12: Delete contact (requires auth)
    if tester.token and contact_id:
        tester.test(
            "DELETE /contacts/{id} - Delete contact (requires auth)",
            "DELETE",
            f"/contacts/{contact_id}",
            200,
            auth=True
        )
    
    # ============================================================
    # 4. SETTINGS TESTS
    # ============================================================
    print("\n" + "="*60)
    print("⚙️  SETTINGS TESTS")
    print("="*60)
    
    # Test 13: Get settings (public)
    success, settings = tester.test(
        "GET /settings - Get site settings (public)",
        "GET",
        "/settings",
        200,
        auth=False
    )
    
    if success:
        tester.log("📋", f"Business: {settings.get('business_name', 'N/A')}")
        tester.log("📋", f"City: {settings.get('city', 'N/A')}")
        tester.log("📋", f"Email: {settings.get('email', 'N/A')}")
    
    # Test 14: Update settings (requires auth)
    if tester.token:
        update_data = {
            "business_name": "Samuel Bocquillon — Photographe de mariage",
            "city": "Valenciennes",
            "phone": "+33 6 12 34 56 78"
        }
        tester.test(
            "PUT /settings - Update settings (requires auth)",
            "PUT",
            "/settings",
            200,
            json_data=update_data,
            auth=True
        )
    
    # ============================================================
    # 5. TESTIMONIALS TESTS
    # ============================================================
    print("\n" + "="*60)
    print("💬 TESTIMONIALS TESTS")
    print("="*60)
    
    # Test 15: Get testimonials (public)
    success, testimonials = tester.test(
        "GET /testimonials - List all testimonials (public)",
        "GET",
        "/testimonials",
        200,
        auth=False
    )
    
    if success and isinstance(testimonials, list):
        tester.log("📋", f"Found {len(testimonials)} testimonials")
        
        # Verify expected count (6 seeded)
        if len(testimonials) >= 6:
            tester.log("✅", "At least 6 seeded testimonials found")
        else:
            tester.log("⚠️", f"Expected at least 6 testimonials, found {len(testimonials)}")
    
    # Test 16: Create testimonial (requires auth)
    testimonial_id = None
    if tester.token:
        new_testimonial = {
            "author": "Test Author",
            "role": "Test Role",
            "text": "Ceci est un témoignage de test.",
            "rating": 5,
            "category": "mariage",
            "featured": False
        }
        
        success, created = tester.test(
            "POST /testimonials - Create testimonial (requires auth)",
            "POST",
            "/testimonials",
            200,
            json_data=new_testimonial,
            auth=True
        )
        
        if success:
            testimonial_id = created.get('id')
            tester.log("📝", f"Testimonial created with ID: {testimonial_id}")
    
    # Test 17: Update testimonial (requires auth)
    if tester.token and testimonial_id:
        update_testimonial = {
            "author": "Updated Author",
            "role": "Updated Role",
            "text": "Témoignage mis à jour.",
            "rating": 4,
            "category": "corporate",
            "featured": True
        }
        
        tester.test(
            "PUT /testimonials/{id} - Update testimonial (requires auth)",
            "PUT",
            f"/testimonials/{testimonial_id}",
            200,
            json_data=update_testimonial,
            auth=True
        )
    
    # Test 18: Delete testimonial (requires auth)
    if tester.token and testimonial_id:
        tester.test(
            "DELETE /testimonials/{id} - Delete testimonial (requires auth)",
            "DELETE",
            f"/testimonials/{testimonial_id}",
            200,
            auth=True
        )
    
    # ============================================================
    # SUMMARY
    # ============================================================
    success = tester.print_summary()
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
