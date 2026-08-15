import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
          "DATABASE_URL manquant. Ajoute la variable d'environnement avec ta chaine de connexion Neon."
        );
}

const sql = neon(connectionString);

export default sql;
