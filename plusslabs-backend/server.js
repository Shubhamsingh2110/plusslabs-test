const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/plusslabs', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
