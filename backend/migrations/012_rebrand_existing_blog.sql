-- Update existing blog posts and defaults to "Học cùng Royce"
UPDATE blog_posts SET
  author_name = REPLACE(author_name, 'Studyield', 'Học cùng Royce'),
  title = REPLACE(title, 'Studyield', 'Học cùng Royce'),
  excerpt = REPLACE(excerpt, 'Studyield', 'Học cùng Royce'),
  content = REPLACE(content, 'Studyield', 'Học cùng Royce'),
  slug = REPLACE(slug, 'studyield', 'royce')
WHERE author_name LIKE '%Studyield%'
   OR title LIKE '%Studyield%'
   OR excerpt LIKE '%Studyield%'
   OR content LIKE '%Studyield%'
   OR slug LIKE '%studyield%';
