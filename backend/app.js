const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config(); 

const authRoute = require('./routes/auth/auth.routes'); 
const bookRoute = require('./routes/book');
const userRoute = require('./routes/user');
const rentalRoute = require('./routes/rental');

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/books',bookRoute);
app.use('/api/user',userRoute);
app.use('/api/rental',rentalRoute);
app.use('/api/rentals',rentalRoute); // Alternative route
app.use('/api/returns', rentalRoute); // For return endpoints
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
