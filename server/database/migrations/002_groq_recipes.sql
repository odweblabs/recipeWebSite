-- 002_groq_recipes.sql

-- Creates the isolated table for recipes_groq_cleaned.json data
CREATE TABLE IF NOT EXISTS groq_recipes (
    id SERIAL PRIMARY KEY,
    tarif_adi VARCHAR UNIQUE NOT NULL,
    kategori VARCHAR,
    porsiyon VARCHAR,
    hazirlik_suresi_dk NUMERIC,
    pisirme_suresi_dk NUMERIC,
    zorluk VARCHAR,
    pisirme_yontemi JSONB,
    malzemeler JSONB,
    yapilis_adimlari JSONB,
    _source JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
