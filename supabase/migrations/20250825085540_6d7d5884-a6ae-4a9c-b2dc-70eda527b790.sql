-- First, let's create a sample therapist profile (you'll need to replace the user_id with an actual user ID from your auth.users table)
-- This is sample data - replace with real data as needed

-- Insert sample therapist (you'll need to replace the user_id with a real one from auth.users)
INSERT INTO public.therapists (id, name, specialization, bio, rating, price, languages, availability, is_verified, avatar_url) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Dr. Ana Popescu', 'Terapie Cognitivă Comportamentală', 'Psiholog clinician cu peste 10 ani de experiență în tratarea anxietății și depresiei. Absolventă a Universității de Psihologie din București.', 4.8, 200, ARRAY['Română', 'Engleză'], 'Disponibil', true, null),
('550e8400-e29b-41d4-a716-446655440002', 'Psih. Mihai Ionescu', 'Terapie de Cuplu', 'Specialist în terapie de cuplu și relații. Ajut cuplurile să își îmbunătățească comunicarea și să depășească conflictele.', 4.6, 180, ARRAY['Română'], 'Disponibil', true, null),
('550e8400-e29b-41d4-a716-446655440003', 'Dr. Maria Georgescu', 'Terapie pentru Copii și Adolescenți', 'Psiholog specializat în lucrul cu copii și adolescenți. Experiență în tratarea ADHD, anxietății și problemelor de comportament.', 4.9, 220, ARRAY['Română', 'Franceză'], 'Disponibil', true, null);

-- Insert sample therapist posts
INSERT INTO public.therapist_posts (id, therapist_id, title, content, excerpt, category, tags, is_published, view_count) VALUES 
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Cum să gestionezi anxietatea în viața de zi cu zi', 'Anxietatea este o parte normală a vieții, dar când devine copleșitoare, poate afecta calitatea vieții noastre. În acest articol, voi împărtăși câteva tehnici practice pentru gestionarea anxietății...', 'Tehnici practice pentru gestionarea anxietății în situațiile de zi cu zi', 'anxiety', ARRAY['anxietate', 'tehnici', 'mindfulness'], true, 45),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Comunicarea în cuplu: 5 principii esențiale', 'Comunicarea este fundamentul oricărei relații sănătoase. Multe cupluri se confruntă cu probleme de comunicare care pot duce la conflicte și neînțelegeri...', '5 principii fundamentale pentru o comunicare eficientă în cuplu', 'relationships', ARRAY['relații', 'comunicare', 'cuplu'], true, 32),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Depresie vs tristețe: să înțelegem diferența', 'Mulți oameni confundă depresia cu tristețea normală. Este important să înțelegem diferența pentru a putea căuta ajutorul potrivit...', 'Diferența dintre depresie și tristețea normală și când să căutăm ajutor', 'depression', ARRAY['depresie', 'tristețe', 'sănătate mintală'], true, 78);

-- Insert sample therapist events
INSERT INTO public.therapist_events (id, therapist_id, title, description, event_date, location, price, max_participants, current_participants, is_active, view_count) VALUES 
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Workshop: Tehnici de relaxare și mindfulness', 'Un workshop interactiv unde veți învăța tehnici practice de relaxare și mindfulness pentru gestionarea stresului zilnic.', '2024-02-15 18:00:00+00', 'Centrul de Terapie Healio, București', 50, 15, 8, true, 23),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Sesiune de grup: Comunicarea în relații', 'O sesiune de grup focusată pe îmbunătățirea comunicării în relațiile personale. Potrivit pentru cupluri și persoane singure.', '2024-02-20 19:00:00+00', 'Online via Zoom', 30, 20, 12, true, 18),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Conferință: Sănătatea mintală la copii', 'O conferință educațională pentru părinți despre cum să sprijine sănătatea mintală a copiilor și să recunoască semnele de alertă.', '2024-02-25 17:30:00+00', 'Casa de Cultură, București', 0, 100, 45, true, 67);

-- Insert sample community posts (you'll need to replace user_id with actual user IDs)
-- These are placeholder posts to demonstrate the functionality
INSERT INTO public.community_posts (id, type, title, content, tags, is_anonymous, like_count, comment_count) VALUES 
('850e8400-e29b-41d4-a716-446655440001', 'question', 'Cum pot depăși anxietatea socială?', 'Salut tuturor! Mă confrunt cu anxietate socială de câțiva ani și îmi este foarte greu să particip la evenimente sociale. Aveți sfaturi sau experiențe pe care le-ați putea împărtăși?', ARRAY['anxietate socială', 'sfaturi', 'ajutor'], false, 12, 8),
('850e8400-e29b-41d4-a716-446655440002', 'post', 'Progresul meu în terapie', 'Vreau să împart cu comunitatea progresul pe care l-am făcut în ultimele 6 luni de terapie. La început era foarte greu, dar acum încep să văd schimbări pozitive în viața mea.', ARRAY['progres', 'terapie', 'motivație'], false, 25, 15),
('850e8400-e29b-41d4-a716-446655440003', 'mood', null, 'Astăzi mă simt mult mai bine decât zilele trecute. Exercițiile de respirație pe care le-am învățat îmi ajută foarte mult să mă calmez când simt că anxietatea crește.', ARRAY['respirație', 'calm'], false, 8, 3);

-- Update the community posts to set user_id to a default UUID for now
-- In a real scenario, you would set these to actual user IDs
UPDATE public.community_posts SET user_id = gen_random_uuid() WHERE user_id IS NULL;