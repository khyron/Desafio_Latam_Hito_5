CREATE TABLE public.macro_photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    photographer VARCHAR(255) NOT NULL,
    camera_model VARCHAR(100),
    lens_model VARCHAR(100),
    aperture VARCHAR(10),
    shutter_speed VARCHAR(20),
    iso INTEGER,
    focal_length VARCHAR(20),
    magnification VARCHAR(20),
    subject VARCHAR(100),
    location VARCHAR(100),
    date_taken DATE,
    description TEXT,
    tags TEXT[]
);