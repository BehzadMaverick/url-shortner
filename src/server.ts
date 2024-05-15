import app from './app';
import { resolve } from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Server Started listening on port ${PORT}`);
});
