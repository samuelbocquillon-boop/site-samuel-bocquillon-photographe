'use client';
import { useState, useEffect } from 'react';
import { AdminBlog } from '@/components/admin/AdminBlog';

export default function AdminBlogPage() {
  const [autoNew, setAutoNew] = useState(null);
  useEffect(() => {
    setAutoNew(window.location.search.includes('new=1'));
  }, []);
  if (autoNew === null) return null;
  return <AdminBlog autoNew={autoNew} />;
}
