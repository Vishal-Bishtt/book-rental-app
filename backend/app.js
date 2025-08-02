const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth/auth.routes'); 
const bookRoute = require('./routes/book');
const userRoute = require('./routes/user');
const rentalRoute = require('./routes/rental');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/books',bookRoute);
app.use('/api/user',userRoute);
app.use('/api/rental',rentalRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
