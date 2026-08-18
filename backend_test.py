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
    # SUMMARY
    # ============================================================
    success = tester.print_summary()
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
