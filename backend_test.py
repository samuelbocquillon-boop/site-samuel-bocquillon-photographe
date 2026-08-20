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
    # NEW FEATURE: IMAGE URL LINKING (CLOUDINARY)
    # ============================================================
    print("\n" + "="*60)
    print("🔗 IMAGE URL LINKING TESTS (NEW FEATURE)")
    print("="*60)
    
    # Test 8a: PUT /images/{slot}/url with Cloudinary URL (requires auth)
    cloudinary_url = "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1787171314/ld-export-2c6c3456-12142025_mqx2xr.jpg"
    if tester.token:
        success, cloudinary_result = tester.test(
            "PUT /images/blog-hero/url - Link Cloudinary URL (should optimize with f_auto,q_auto + srcset)",
            "PUT",
            "/images/blog-hero/url",
            200,
            json_data={"url": cloudinary_url, "alt": "Test Cloudinary Image"},
            auth=True
        )
        
        if success:
            # Verify custom:true
            if cloudinary_result.get('custom') == True:
                tester.log("✅", "custom=true (image is customized)")
            else:
                tester.log("⚠️", f"Expected custom=true, got {cloudinary_result.get('custom')}")
            
            # Verify URL contains f_auto,q_auto,w_1600
            url = cloudinary_result.get('url', '')
            if 'f_auto' in url and 'q_auto' in url and 'w_1600' in url:
                tester.log("✅", "URL contains Cloudinary optimizations (f_auto,q_auto,w_1600)")
            else:
                tester.log("⚠️", f"URL missing optimizations: {url}")
            
            # Verify srcset has 4 sizes (480, 960, 1600, 2400)
            srcset = cloudinary_result.get('srcset', '')
            if srcset:
                sizes = ['480w', '960w', '1600w', '2400w']
                missing = [s for s in sizes if s not in srcset]
                if not missing:
                    tester.log("✅", "srcset contains all 4 sizes (480/960/1600/2400)")
                else:
                    tester.log("⚠️", f"srcset missing sizes: {missing}")
            else:
                tester.log("⚠️", "srcset is empty or null")
    
    # Test 8b: GET /images/blog-hero - Verify URL was saved
    success, blog_hero = tester.test(
        "GET /images/blog-hero - Verify Cloudinary URL was saved",
        "GET",
        "/images/blog-hero",
        200,
        auth=False
    )
    
    if success:
        url = blog_hero.get('url', '')
        if 'res.cloudinary.com' in url and 'f_auto' in url:
            tester.log("✅", "Cloudinary URL persisted correctly")
        else:
            tester.log("⚠️", f"URL not persisted correctly: {url}")
    
    # Test 8c: PUT /images/{slot}/url with non-Cloudinary URL (requires auth)
    unsplash_url = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
    if tester.token:
        success, unsplash_result = tester.test(
            "PUT /images/blog-hero/url - Link non-Cloudinary URL (should NOT optimize, srcset=null)",
            "PUT",
            "/images/blog-hero/url",
            200,
            json_data={"url": unsplash_url, "alt": "Test Unsplash Image"},
            auth=True
        )
        
        if success:
            # Verify URL is unchanged
            url = unsplash_result.get('url', '')
            if url == unsplash_url:
                tester.log("✅", "Non-Cloudinary URL unchanged")
            else:
                tester.log("⚠️", f"Expected {unsplash_url}, got {url}")
            
            # Verify srcset is null or empty
            srcset = unsplash_result.get('srcset')
            if srcset is None or srcset == '':
                tester.log("✅", "srcset is null (no optimization for non-Cloudinary)")
            else:
                tester.log("⚠️", f"Expected srcset=null, got {srcset}")
    
    # Test 8d: PUT /images/{slot}/url with invalid URL (should return 400)
    if tester.token:
        tester.test(
            "PUT /images/blog-hero/url - Invalid URL 'pas-une-url' (should return 400)",
            "PUT",
            "/images/blog-hero/url",
            400,
            json_data={"url": "pas-une-url", "alt": "Test"},
            auth=True
        )
    
    # Test 8e: PUT /images/{slot}/url with non-existent slot (should return 404)
    if tester.token:
        tester.test(
            "PUT /images/non-existent-slot/url - Non-existent slot (should return 404)",
            "PUT",
            "/images/non-existent-slot-xyz/url",
            404,
            json_data={"url": cloudinary_url, "alt": "Test"},
            auth=True
        )
    
    # Test 8f: PUT /images/{slot}/url without auth (should return 401/403)
    tester.test(
        "PUT /images/blog-hero/url - Without auth (should return 401/403)",
        "PUT",
        "/images/blog-hero/url",
        401,
        json_data={"url": cloudinary_url, "alt": "Test"},
        auth=False
    )
    
    # Test 8g: DELETE /images/blog-hero - Restore default (cleanup)
    if tester.token:
        success, delete_result = tester.test(
            "DELETE /images/blog-hero - Restore default (cleanup after URL tests)",
            "DELETE",
            "/images/blog-hero",
            200,
            auth=True
        )
        
        if success:
            # Verify it's back to default
            success, restored = tester.test(
                "GET /images/blog-hero - Verify restored to default",
                "GET",
                "/images/blog-hero",
                200,
                auth=False
            )
            
            if success:
                if restored.get('custom') == False:
                    tester.log("✅", "Slot restored to default (custom=false)")
                else:
                    tester.log("⚠️", f"Expected custom=false, got {restored.get('custom')}")
    
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
    # 6. BLOG TESTS (NEW FEATURE)
    # ============================================================
    print("\n" + "="*60)
    print("📝 BLOG TESTS (NEW FEATURE)")
    print("="*60)
    
    # Test 19: Get blog posts (public, should auto-seed 9 demo posts)
    success, blog_data = tester.test(
        "GET /blog/posts - List published blog posts (should return 9 seeded posts)",
        "GET",
        "/blog/posts",
        200,
        auth=False
    )
    
    if success:
        posts_count = len(blog_data.get('posts', []))
        total = blog_data.get('total', 0)
        pages = blog_data.get('pages', 0)
        tester.log("📋", f"Found {posts_count} posts (total: {total}, pages: {pages})")
        
        if total == 9:
            tester.log("✅", "Correct: 9 demo posts seeded")
        else:
            tester.log("⚠️", f"Expected 9 posts, found {total}")
        
        # Verify pagination (limit=9 should give 1 page)
        if pages == 1:
            tester.log("✅", "Correct: 1 page with limit=9")
        else:
            tester.log("⚠️", f"Expected 1 page, found {pages}")
        
        # Verify post structure
        if posts_count > 0:
            first_post = blog_data['posts'][0]
            required_fields = ['title', 'slug', 'excerpt', 'category', 'cover', 'date', 'location']
            missing = [f for f in required_fields if f not in first_post]
            if not missing:
                tester.log("✅", "Post structure correct (title/slug/excerpt/category/cover/date/location)")
            else:
                tester.log("⚠️", f"Missing fields in post: {missing}")
    
    # Test 20: Filter by category 'mariages' (should return 7 posts)
    success, mariages_data = tester.test(
        "GET /blog/posts?category=mariages - Filter by category (should return 7 posts)",
        "GET",
        "/blog/posts?category=mariages",
        200,
        auth=False
    )
    
    if success:
        count = mariages_data.get('total', 0)
        if count == 7:
            tester.log("✅", f"Correct: 7 'mariages' posts")
        else:
            tester.log("⚠️", f"Expected 7 'mariages' posts, found {count}")
    
    # Test 21: Filter by category 'inspiration' (should return 1 post)
    success, inspiration_data = tester.test(
        "GET /blog/posts?category=inspiration - Filter by category (should return 1 post)",
        "GET",
        "/blog/posts?category=inspiration",
        200,
        auth=False
    )
    
    if success:
        count = inspiration_data.get('total', 0)
        if count == 1:
            tester.log("✅", f"Correct: 1 'inspiration' post")
        else:
            tester.log("⚠️", f"Expected 1 'inspiration' post, found {count}")
    
    # Test 22: Filter by lieu 'Lens' (should return 1 post)
    success, lens_data = tester.test(
        "GET /blog/posts?lieu=Lens - Filter by location (should return 1 post)",
        "GET",
        "/blog/posts?lieu=Lens",
        200,
        auth=False
    )
    
    if success:
        count = lens_data.get('total', 0)
        if count == 1:
            tester.log("✅", f"Correct: 1 post in 'Lens'")
        else:
            tester.log("⚠️", f"Expected 1 post in 'Lens', found {count}")
    
    # Test 23: Search by keyword 'aubry' (should return 1 post)
    success, search_data = tester.test(
        "GET /blog/posts?q=aubry - Search by keyword (should return 1 post)",
        "GET",
        "/blog/posts?q=aubry",
        200,
        auth=False
    )
    
    if success:
        count = search_data.get('total', 0)
        if count == 1:
            tester.log("✅", f"Correct: 1 post matching 'aubry'")
        else:
            tester.log("⚠️", f"Expected 1 post matching 'aubry', found {count}")
    
    # Test 24: Combined filters (category + lieu)
    success, combined_data = tester.test(
        "GET /blog/posts?category=mariages&lieu=Lens - Combined filters",
        "GET",
        "/blog/posts?category=mariages&lieu=Lens",
        200,
        auth=False
    )
    
    if success:
        count = combined_data.get('total', 0)
        tester.log("📋", f"Combined filter returned {count} posts")
    
    # Test 25: Get single blog post by slug
    success, post_detail = tester.test(
        "GET /blog/posts/mariage-chateau-aubry-aubry-du-hainaut - Get post by slug",
        "GET",
        "/blog/posts/mariage-chateau-aubry-aubry-du-hainaut",
        200,
        auth=False
    )
    
    if success:
        post = post_detail.get('post', {})
        related = post_detail.get('related', [])
        discover = post_detail.get('discover', [])
        blocks = post.get('blocks', [])
        
        tester.log("📋", f"Post has {len(blocks)} blocks, {len(related)} related, {len(discover)} discover")
        
        # Verify blocks count (should be 16 for this specific post)
        if len(blocks) == 16:
            tester.log("✅", "Correct: 16 blocks in post")
        else:
            tester.log("⚠️", f"Expected 16 blocks, found {len(blocks)}")
        
        # Verify related count (should be 3)
        if len(related) == 3:
            tester.log("✅", "Correct: 3 related posts")
        else:
            tester.log("⚠️", f"Expected 3 related posts, found {len(related)}")
        
        # Verify discover count (should be 3)
        if len(discover) == 3:
            tester.log("✅", "Correct: 3 discover posts")
        else:
            tester.log("⚠️", f"Expected 3 discover posts, found {len(discover)}")
    
    # Test 26: Get non-existent post (should return 404)
    tester.test(
        "GET /blog/posts/non-existent-slug - Non-existent post (should return 404)",
        "GET",
        "/blog/posts/non-existent-slug-xyz",
        404,
        auth=False
    )
    
    # Test 27: Get blog locations
    success, locations = tester.test(
        "GET /blog/locations - Get all locations (venues/cities/departments)",
        "GET",
        "/blog/locations",
        200,
        auth=False
    )
    
    if success:
        venues = locations.get('venues', [])
        cities = locations.get('cities', [])
        departments = locations.get('departments', [])
        tester.log("📋", f"Locations: {len(venues)} venues, {len(cities)} cities, {len(departments)} departments")
    
    # Test 28: Get blog sitemap
    success, sitemap = tester.test(
        "GET /blog/sitemap - Get sitemap data (slugs + page count)",
        "GET",
        "/blog/sitemap",
        200,
        auth=False
    )
    
    if success:
        posts = sitemap.get('posts', [])
        pages = sitemap.get('pages', 0)
        tester.log("📋", f"Sitemap: {len(posts)} posts, {pages} pages")
        
        if len(posts) == 9:
            tester.log("✅", "Correct: 9 posts in sitemap")
        else:
            tester.log("⚠️", f"Expected 9 posts in sitemap, found {len(posts)}")
    
    # ============================================================
    # 7. BLOG ADMIN TESTS (requires auth)
    # ============================================================
    print("\n" + "="*60)
    print("🔐 BLOG ADMIN TESTS (requires auth)")
    print("="*60)
    
    if not tester.token:
        tester.log("⚠️", "Skipping admin blog tests - no auth token")
    else:
        # Test 29: Get admin blog posts
        success, admin_posts = tester.test(
            "GET /blog/admin/posts - List all posts (admin, should return 9)",
            "GET",
            "/blog/admin/posts",
            200,
            auth=True
        )
        
        if success:
            count = len(admin_posts)
            if count == 9:
                tester.log("✅", f"Correct: 9 posts in admin list")
            else:
                tester.log("⚠️", f"Expected 9 posts, found {count}")
        
        # Test 30: Create new blog post
        new_post = {
            "title": "Test Wedding Samuel",
            "slug": "",  # Should auto-generate
            "excerpt": "This is a test article created by the testing agent.",
            "category": "mariages",
            "cover": {"url": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600", "alt": "Test cover"},
            "date": "",  # Should auto-generate
            "author": "Samuel Bocquillon",
            "tags": ["test", "automated"],
            "location": {
                "venue": "Test Venue",
                "city": "Test City",
                "postal_code": "59000",
                "department": "Nord – 59",
                "region": "Hauts-de-France",
                "country": "France"
            },
            "seo": {
                "meta_title": "Test Wedding Samuel",
                "meta_description": "Test description",
                "keyword": "test wedding",
                "og_image": "",
                "canonical": "",
                "noindex": False
            },
            "blocks": [
                {"type": "heading", "text": "Test Heading"},
                {"type": "text", "text": "This is test content for the automated test."}
            ],
            "status": "published"
        }
        
        created_post_id = None
        success, created = tester.test(
            "POST /blog/admin/posts - Create new post (should auto-generate slug)",
            "POST",
            "/blog/admin/posts",
            200,
            json_data=new_post,
            auth=True
        )
        
        if success:
            created_post_id = created.get('id')
            created_slug = created.get('slug')
            tester.log("📝", f"Post created with ID: {created_post_id}, slug: {created_slug}")
            
            # Verify slug was auto-generated
            if created_slug and created_slug.startswith('test-wedding-samuel'):
                tester.log("✅", "Slug auto-generated correctly")
            else:
                tester.log("⚠️", f"Unexpected slug: {created_slug}")
        
        # Test 31: Verify created post appears in public list
        if created_post_id:
            success, public_check = tester.test(
                "GET /blog/posts - Verify new published post appears in public list",
                "GET",
                "/blog/posts",
                200,
                auth=False
            )
            
            if success:
                total = public_check.get('total', 0)
                if total == 10:  # 9 demo + 1 new
                    tester.log("✅", "New post appears in public list (10 total)")
                else:
                    tester.log("⚠️", f"Expected 10 posts, found {total}")
        
        # Test 32: Update post
        if created_post_id:
            updated_post = new_post.copy()
            updated_post['title'] = "Test Wedding Samuel (Updated)"
            updated_post['excerpt'] = "Updated excerpt"
            
            tester.test(
                "PUT /blog/admin/posts/{id} - Update post",
                "PUT",
                f"/blog/admin/posts/{created_post_id}",
                200,
                json_data=updated_post,
                auth=True
            )
        
        # Test 33: Change status to draft (should NOT appear in public list)
        if created_post_id:
            success, status_change = tester.test(
                "PUT /blog/admin/posts/{id}/status - Change status to draft",
                "PUT",
                f"/blog/admin/posts/{created_post_id}/status",
                200,
                json_data={"status": "draft"},
                auth=True
            )
            
            if success:
                # Verify it doesn't appear in public list
                success, public_check = tester.test(
                    "GET /blog/posts - Verify draft post does NOT appear in public list",
                    "GET",
                    "/blog/posts",
                    200,
                    auth=False
                )
                
                if success:
                    total = public_check.get('total', 0)
                    if total == 9:  # Back to 9 (draft excluded)
                        tester.log("✅", "Draft post correctly excluded from public list")
                    else:
                        tester.log("⚠️", f"Expected 9 posts (draft excluded), found {total}")
        
        # Test 34: Duplicate post
        duplicate_id = None
        if created_post_id:
            success, duplicated = tester.test(
                "POST /blog/admin/posts/{id}/duplicate - Duplicate post (should create draft with -copie slug)",
                "POST",
                f"/blog/admin/posts/{created_post_id}/duplicate",
                200,
                auth=True
            )
            
            if success:
                duplicate_id = duplicated.get('id')
                duplicate_slug = duplicated.get('slug')
                duplicate_status = duplicated.get('status')
                tester.log("📝", f"Duplicate created with ID: {duplicate_id}, slug: {duplicate_slug}, status: {duplicate_status}")
                
                # Verify it's a draft
                if duplicate_status == 'draft':
                    tester.log("✅", "Duplicate correctly created as draft")
                else:
                    tester.log("⚠️", f"Expected draft status, got {duplicate_status}")
                
                # Verify slug contains 'copie'
                if 'copie' in duplicate_slug:
                    tester.log("✅", "Duplicate slug contains 'copie'")
                else:
                    tester.log("⚠️", f"Expected 'copie' in slug, got {duplicate_slug}")
        
        # Test 35: Delete duplicate
        if duplicate_id:
            tester.test(
                "DELETE /blog/admin/posts/{id} - Delete duplicate post",
                "DELETE",
                f"/blog/admin/posts/{duplicate_id}",
                200,
                auth=True
            )
        
        # Test 36: Delete test post
        if created_post_id:
            tester.test(
                "DELETE /blog/admin/posts/{id} - Delete test post",
                "DELETE",
                f"/blog/admin/posts/{created_post_id}",
                200,
                auth=True
            )
        
        # Test 37: Blog upload (admin, requires auth)
        # Note: We're not testing actual file upload here, just auth protection
        tester.test(
            "POST /blog/upload - Upload without auth (should return 401/403)",
            "POST",
            "/blog/upload",
            401,
            auth=False
        )
    
    # ============================================================
    # 8. ADMIN DASHBOARD (PHASE A CMS) TESTS
    # ============================================================
    print("\n" + "="*60)
    print("🎛️  ADMIN DASHBOARD (PHASE A CMS) TESTS")
    print("="*60)
    
    if not tester.token:
        tester.log("⚠️", "Skipping admin dashboard tests - no auth token")
    else:
        # Test 38: Get admin stats
        success, stats = tester.test(
            "GET /admin/stats - Get dashboard KPIs (requires auth)",
            "GET",
            "/admin/stats",
            200,
            auth=True
        )
        
        if success:
            tester.log("📊", f"Articles published: {stats.get('articles_published', 'N/A')}")
            tester.log("📊", f"Articles this month: {stats.get('articles_month', 'N/A')}")
            tester.log("📊", f"Pages active: {stats.get('pages_active', 'N/A')}")
            tester.log("📊", f"Demandes total: {stats.get('demandes_total', 'N/A')}")
            tester.log("📊", f"Demandes unread: {stats.get('demandes_unread', 'N/A')}")
            tester.log("📊", f"Images total: {stats.get('images_total', 'N/A')}")
            tester.log("📊", f"Images this month: {stats.get('images_month', 'N/A')}")
            
            # Verify pages_active is 17
            if stats.get('pages_active') == 17:
                tester.log("✅", "Correct: 17 pages active")
            else:
                tester.log("⚠️", f"Expected 17 pages active, found {stats.get('pages_active')}")
        
        # Test 39: Get admin pages
        success, pages_data = tester.test(
            "GET /admin/pages - Get all pages (requires auth, should return 17)",
            "GET",
            "/admin/pages",
            200,
            auth=True
        )
        
        if success:
            pages = pages_data.get('pages', [])
            if len(pages) == 17:
                tester.log("✅", f"Correct: 17 pages returned")
            else:
                tester.log("⚠️", f"Expected 17 pages, found {len(pages)}")
        
        # Test 40: Get admin sections (should auto-seed 7 sections)
        success, sections = tester.test(
            "GET /admin/sections - Get home sections (requires auth, should return 7)",
            "GET",
            "/admin/sections",
            200,
            auth=True
        )
        
        section_ids = []
        if success:
            if len(sections) == 7:
                tester.log("✅", f"Correct: 7 sections returned")
            else:
                tester.log("⚠️", f"Expected 7 sections, found {len(sections)}")
            
            # Verify expected sections
            expected_keys = ['hero', 'a-propos', 'portfolio', 'prestations', 'temoignages', 'cta', 'contact']
            found_keys = [s.get('key') for s in sections]
            section_ids = [s.get('id') for s in sections]
            
            if set(found_keys) == set(expected_keys):
                tester.log("✅", "All expected sections present")
            else:
                missing = set(expected_keys) - set(found_keys)
                extra = set(found_keys) - set(expected_keys)
                if missing:
                    tester.log("⚠️", f"Missing sections: {missing}")
                if extra:
                    tester.log("⚠️", f"Extra sections: {extra}")
            
            # Verify all sections are active by default
            all_active = all(s.get('actif') for s in sections)
            if all_active:
                tester.log("✅", "All sections active by default")
            else:
                tester.log("⚠️", "Some sections not active by default")
        
        # Test 41: Reorder sections
        if section_ids and len(section_ids) >= 2:
            # Reverse the order
            reversed_ids = list(reversed(section_ids))
            success, reorder_result = tester.test(
                "PUT /admin/sections/order - Reorder sections (requires auth)",
                "PUT",
                "/admin/sections/order",
                200,
                json_data={"ids": reversed_ids},
                auth=True
            )
            
            if success:
                # Verify new order
                success, sections_after = tester.test(
                    "GET /admin/sections - Verify new order",
                    "GET",
                    "/admin/sections",
                    200,
                    auth=True
                )
                
                if success:
                    new_ids = [s.get('id') for s in sections_after]
                    if new_ids == reversed_ids:
                        tester.log("✅", "Section order persisted correctly")
                    else:
                        tester.log("⚠️", "Section order not persisted correctly")
                    
                    # Restore original order
                    tester.test(
                        "PUT /admin/sections/order - Restore original order",
                        "PUT",
                        "/admin/sections/order",
                        200,
                        json_data={"ids": section_ids},
                        auth=True
                    )
        
        # Test 42: Toggle section active status
        if section_ids:
            first_section_id = section_ids[0]
            
            # Toggle to inactive
            success, toggle_result = tester.test(
                "PUT /admin/sections/{id} - Toggle section to inactive (requires auth)",
                "PUT",
                f"/admin/sections/{first_section_id}",
                200,
                json_data={"actif": False},
                auth=True
            )
            
            if success:
                if toggle_result.get('actif') == False:
                    tester.log("✅", "Section toggled to inactive")
                else:
                    tester.log("⚠️", "Section not toggled to inactive")
                
                # Toggle back to active
                success, restore_result = tester.test(
                    "PUT /admin/sections/{id} - Toggle section back to active",
                    "PUT",
                    f"/admin/sections/{first_section_id}",
                    200,
                    json_data={"actif": True},
                    auth=True
                )
                
                if success and restore_result.get('actif') == True:
                    tester.log("✅", "Section restored to active")
        
        # Test 43: Get recent media
        success, media = tester.test(
            "GET /admin/media/recent - Get recent media (requires auth, should return 6)",
            "GET",
            "/admin/media/recent?limit=6",
            200,
            auth=True
        )
        
        if success:
            if len(media) == 6:
                tester.log("✅", f"Correct: 6 media items returned")
            else:
                tester.log("⚠️", f"Expected 6 media items, found {len(media)}")
        
        # Test 44: Pipeline status update (create a contact first)
        contact_data = {
            "name": "Test Pipeline User",
            "email": "pipeline@test.com",
            "phone": "0612345678",
            "wedding_date": "2025-10-20",
            "wedding_location": "Valenciennes",
            "message": "Test message for pipeline testing."
        }
        
        success, contact_response = tester.test(
            "POST /contact - Create contact for pipeline testing",
            "POST",
            "/contact",
            200,
            json_data=contact_data,
            auth=False
        )
        
        pipeline_contact_id = None
        if success:
            pipeline_contact_id = contact_response.get('id')
            tester.log("📬", f"Pipeline test contact created with ID: {pipeline_contact_id}")
        
        # Test 45: Update pipeline status to 'confirmee'
        if pipeline_contact_id:
            success, pipeline_result = tester.test(
                "PUT /contacts/{id}/pipeline - Update pipeline status to 'confirmee' (requires auth)",
                "PUT",
                f"/contacts/{pipeline_contact_id}/pipeline",
                200,
                json_data={"status": "confirmee", "note": "test note", "amount": "1500"},
                auth=True
            )
            
            if success:
                if pipeline_result.get('pipeline_status') == 'confirmee':
                    tester.log("✅", "Pipeline status updated to 'confirmee'")
                else:
                    tester.log("⚠️", f"Expected status 'confirmee', got {pipeline_result.get('pipeline_status')}")
                
                if pipeline_result.get('pipeline_note') == 'test note':
                    tester.log("✅", "Pipeline note persisted")
                else:
                    tester.log("⚠️", "Pipeline note not persisted")
                
                if pipeline_result.get('pipeline_amount') == '1500':
                    tester.log("✅", "Pipeline amount persisted")
                else:
                    tester.log("⚠️", "Pipeline amount not persisted")
        
        # Test 46: Invalid pipeline status (should return 400)
        if pipeline_contact_id:
            tester.test(
                "PUT /contacts/{id}/pipeline - Invalid status (should return 400)",
                "PUT",
                f"/contacts/{pipeline_contact_id}/pipeline",
                400,
                json_data={"status": "invalid_status"},
                auth=True
            )
        
        # Test 47: Pipeline without auth (should return 401/403)
        if pipeline_contact_id:
            tester.test(
                "PUT /contacts/{id}/pipeline - Without auth (should return 401/403)",
                "PUT",
                f"/contacts/{pipeline_contact_id}/pipeline",
                401,
                json_data={"status": "nouvelle"},
                auth=False
            )
        
        # Cleanup: Delete pipeline test contact
        if pipeline_contact_id:
            tester.test(
                "DELETE /contacts/{id} - Delete pipeline test contact",
                "DELETE",
                f"/contacts/{pipeline_contact_id}",
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
