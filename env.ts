import { z } from "zod";
const envVariables = z.object({ 
    DATABASE_URL: z.string(), 
    JWT_SECRET: z.string(),
    WS_PORT: z.string().optional(),
    WS_HOST: z.string().optional(),
    ERROR_LOG_PATH: z.string()
});
envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}
