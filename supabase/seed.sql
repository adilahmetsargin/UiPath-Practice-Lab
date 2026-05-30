insert into public.lessons (id, level_number, title, summary, focus) values
('rpa-basics', 1, 'RPA basics', 'Learn what RPA is, how bots follow repeatable rules, and how to choose tasks worth automating.', 'Understand process thinking before opening UiPath.'),
('studio-basics', 2, 'UiPath Studio basics', 'Practice activities, sequences, workflows, packages, and run/debug behavior.', 'Navigate Studio and build your first browser workflow.'),
('variables-arguments-data-types', 3, 'Variables, arguments, data types', 'Use strings, numbers, booleans, dates, arrays, and DataTables to drive automation logic.', 'Pass data through workflows reliably.'),
('selectors-ui-automation', 4, 'Selectors and UI automation', 'Practice selectors, anchors, dynamic attributes, waits, and reliable clicking.', 'Make browser automation stable on changing pages.'),
('excel-automation', 5, 'Excel automation', 'Use workbook data as input to browser processes and output status columns.', 'Read, transform, and write spreadsheet-driven work.'),
('web-automation', 6, 'Web automation', 'Work with forms, search pages, tables, confirmations, and browser smoke tests.', 'Complete realistic browser workflows end to end.'),
('email-automation', 7, 'Email automation', 'Design email notifications, filters, summaries, and alert paths safely.', 'Trigger notifications and parse inbox-driven work.'),
('pdf-document-automation', 8, 'PDF and document automation', 'Practice document handling patterns used in invoice and onboarding workflows.', 'Extract document data and validate it against business rules.'),
('data-scraping', 9, 'Data scraping', 'Extract repeatable lists, tables, and filtered results from web pages.', 'Collect structured data from pages and verify completeness.'),
('error-handling-debugging', 10, 'Error handling and debugging', 'Practice Try Catch, logs, screenshots, retries, and continuation rules.', 'Build automations that fail clearly and recover when possible.'),
('reframework-basics', 11, 'REFramework basics', 'Learn the transaction mindset behind production UiPath projects.', 'Structure bots like production RPA projects.'),
('real-world-mini-projects', 12, 'Real-world mini projects', 'Build compact workplace-style automations with inputs, outputs, and support notes.', 'Combine skills into portfolio-ready automations.'),
('interview-qa-rpa-job-tasks', 13, 'Interview preparation and QA/RPA job tasks', 'Prepare scenario answers, demos, debugging explanations, and QA checklists.', 'Practice explaining your work like a job candidate.')
on conflict (id) do nothing;

insert into public.badges (id, name, description, xp_required) values
('first-bot', 'First Bot', 'Complete your first browser automation task.', 25),
('selector-solver', 'Selector Solver', 'Finish Level 4 selector challenges.', 250),
('spreadsheet-operator', 'Spreadsheet Operator', 'Complete Excel-driven form entry.', 450),
('exception-handler', 'Exception Handler', 'Classify and recover from errors.', 900),
('job-ready-builder', 'Job Ready Builder', 'Complete a real-world mini project.', 1300)
on conflict (id) do nothing;

-- The app includes the complete 52-task seed catalog in lib/course-data.ts.
-- For production, import that catalog into public.tasks with a small script or SQL generated from the TypeScript data.
