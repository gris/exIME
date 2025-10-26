-- Seed data for local development
-- This file is automatically applied when you run `supabase db reset`

-- Insert sample alumni profiles
INSERT INTO public.alumni (
    name, 
    email, 
    phone,
    graduation_year, 
    role,
    current_company,
    linkedin,
    technologies,
    expertise_fields,
    profile_image_url
) VALUES
-- 2020 Graduates
(
    'João Silva',
    'joao.silva@ime.eb.br',
    '+55 21 98765-4321',
    2020,
    'Senior Software Engineer',
    'Nubank',
    'https://linkedin.com/in/joaosilva',
    ARRAY['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    ARRAY['Backend Development', 'Cloud Architecture', 'DevOps'],
    NULL
),
(
    'Maria Santos',
    'maria.santos@ime.eb.br',
    '+55 21 98765-4322',
    2020,
    'Tech Lead',
    'Stone',
    'https://linkedin.com/in/mariasantos',
    ARRAY['Java', 'Spring Boot', 'Kubernetes', 'Microservices', 'React'],
    ARRAY['Full Stack Development', 'System Architecture', 'Team Leadership'],
    NULL
),
(
    'Pedro Oliveira',
    'pedro.oliveira@ime.eb.br',
    '+55 21 98765-4323',
    2020,
    'Data Scientist',
    'iFood',
    'https://linkedin.com/in/pedrooliveira',
    ARRAY['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Spark'],
    ARRAY['Machine Learning', 'Data Analysis', 'Big Data'],
    NULL
),

-- 2021 Graduates
(
    'Ana Costa',
    'ana.costa@ime.eb.br',
    '+55 21 98765-4324',
    2021,
    'Frontend Developer',
    'Mercado Livre',
    'https://linkedin.com/in/anacosta',
    ARRAY['TypeScript', 'React', 'Vue.js', 'Next.js', 'Tailwind CSS'],
    ARRAY['Frontend Development', 'UI/UX', 'Web Performance'],
    NULL
),
(
    'Carlos Ferreira',
    'carlos.ferreira@ime.eb.br',
    '+55 21 98765-4325',
    2021,
    'DevOps Engineer',
    'Globo.com',
    'https://linkedin.com/in/carlosferreira',
    ARRAY['Kubernetes', 'Terraform', 'AWS', 'GitLab CI', 'Prometheus'],
    ARRAY['Infrastructure', 'CI/CD', 'Monitoring'],
    NULL
),
(
    'Beatriz Lima',
    'beatriz.lima@ime.eb.br',
    '+55 21 98765-4326',
    2021,
    'Mobile Developer',
    'PicPay',
    'https://linkedin.com/in/beatrizlima',
    ARRAY['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    ARRAY['Mobile Development', 'Cross-platform Apps', 'Mobile UX'],
    NULL
),

-- 2022 Graduates
(
    'Rafael Almeida',
    'rafael.almeida@ime.eb.br',
    '+55 21 98765-4327',
    2022,
    'Software Engineer',
    'Banco Inter',
    'https://linkedin.com/in/rafaelalmeida',
    ARRAY['Go', 'gRPC', 'PostgreSQL', 'Redis', 'RabbitMQ'],
    ARRAY['Backend Development', 'Distributed Systems', 'API Design'],
    NULL
),
(
    'Juliana Rodrigues',
    'juliana.rodrigues@ime.eb.br',
    '+55 21 98765-4328',
    2022,
    'Security Engineer',
    'Visa',
    'https://linkedin.com/in/julianarodrigues',
    ARRAY['Python', 'Burp Suite', 'Metasploit', 'AWS Security', 'Docker'],
    ARRAY['Cybersecurity', 'Penetration Testing', 'Security Audits'],
    NULL
),
(
    'Lucas Martins',
    'lucas.martins@ime.eb.br',
    '+55 21 98765-4329',
    2022,
    'Cloud Architect',
    'Totvs',
    'https://linkedin.com/in/lucasmartins',
    ARRAY['AWS', 'Azure', 'Terraform', 'CloudFormation', 'Serverless'],
    ARRAY['Cloud Architecture', 'Cost Optimization', 'Multi-cloud Strategy'],
    NULL
),

-- 2023 Graduates
(
    'Gabriela Souza',
    'gabriela.souza@ime.eb.br',
    '+55 21 98765-4330',
    2023,
    'Full Stack Developer',
    'Elo',
    'https://linkedin.com/in/gabrielasouza',
    ARRAY['JavaScript', 'Node.js', 'React', 'MongoDB', 'Express'],
    ARRAY['Full Stack Development', 'REST APIs', 'Database Design'],
    NULL
),
(
    'Thiago Carvalho',
    'thiago.carvalho@ime.eb.br',
    '+55 21 98765-4331',
    2023,
    'AI Engineer',
    'Movile',
    'https://linkedin.com/in/thiagocarvalho',
    ARRAY['Python', 'LangChain', 'OpenAI API', 'Vector Databases', 'FastAPI'],
    ARRAY['Artificial Intelligence', 'LLMs', 'RAG Systems'],
    NULL
),
(
    'Fernanda Ribeiro',
    'fernanda.ribeiro@ime.eb.br',
    '+55 21 98765-4332',
    2023,
    'Junior Software Engineer',
    'QuintoAndar',
    'https://linkedin.com/in/fernandaribeiro',
    ARRAY['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
    ARRAY['Backend Development', 'Web Development', 'Agile'],
    NULL
),

-- 2024 Graduates (Recent)
(
    'Bruno Mendes',
    'bruno.mendes@ime.eb.br',
    '+55 21 98765-4333',
    2024,
    'Software Engineer',
    'Wildlife Studios',
    'https://linkedin.com/in/brunomendes',
    ARRAY['C++', 'Unity', 'C#', 'Game Development', 'Performance Optimization'],
    ARRAY['Game Development', 'Real-time Systems', 'Graphics Programming'],
    NULL
),
(
    'Camila Araújo',
    'camila.araujo@ime.eb.br',
    '+55 21 98765-4334',
    2024,
    'Data Engineer',
    'Creditas',
    'https://linkedin.com/in/camilaaraujo',
    ARRAY['Python', 'Airflow', 'dbt', 'Snowflake', 'Spark'],
    ARRAY['Data Engineering', 'ETL Pipelines', 'Data Warehousing'],
    NULL
),
(
    'Diego Pereira',
    'diego.pereira@ime.eb.br',
    '+55 21 98765-4335',
    2024,
    'Platform Engineer',
    'Loggi',
    'https://linkedin.com/in/diegopereira',
    ARRAY['Kubernetes', 'Istio', 'Golang', 'Helm', 'ArgoCD'],
    ARRAY['Platform Engineering', 'Service Mesh', 'Developer Experience'],
    NULL
),

-- Alumni without clerk_user_id (unclaimed profiles for testing email-based claiming)
(
    'Amanda Silva',
    'amanda.silva@ime.eb.br',
    '+55 21 98765-4336',
    2019,
    'Engineering Manager',
    'Rappi',
    'https://linkedin.com/in/amandasilva',
    ARRAY['Leadership', 'Project Management', 'Python', 'Agile', 'Scrum'],
    ARRAY['Engineering Management', 'Team Building', 'Technical Leadership'],
    NULL
),
(
    'Rodrigo Gomes',
    'rodrigo.gomes@ime.eb.br',
    '+55 21 98765-4337',
    2018,
    'Principal Engineer',
    'Magazine Luiza',
    'https://linkedin.com/in/rodrigogomes',
    ARRAY['Java', 'Kafka', 'Elasticsearch', 'Redis', 'Microservices'],
    ARRAY['Distributed Systems', 'Event-Driven Architecture', 'System Design'],
    NULL
),
(
    'Patricia Nunes',
    'patricia.nunes@ime.eb.br',
    '+55 21 98765-4338',
    2017,
    'CTO',
    'Startup XYZ',
    'https://linkedin.com/in/patricianunes',
    ARRAY['Leadership', 'Architecture', 'AWS', 'Python', 'Node.js'],
    ARRAY['Technical Leadership', 'Product Strategy', 'Team Management'],
    NULL
);

-- Insert sample encontros
INSERT INTO public.encontros (
    date,
    time,
    topics
) VALUES
(
    '2025-10-30',
    '20:30:00',
    '[{"speaker": "TBD", "talk_name": "Vibe Coding na Prática"}]'::jsonb
);

-- Display seed statistics
SELECT 
    COUNT(*) as total_alumni,
    COUNT(DISTINCT graduation_year) as years_represented,
    MIN(graduation_year) as earliest_graduation,
    MAX(graduation_year) as latest_graduation
FROM public.alumni;

-- Display alumni by graduation year
SELECT 
    graduation_year,
    COUNT(*) as count
FROM public.alumni
GROUP BY graduation_year
ORDER BY graduation_year DESC;

