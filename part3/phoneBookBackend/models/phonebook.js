import mongoose from 'mongoose'
import 'dotenv/config'
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PhonebookSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 5},
  number: {type: String, required: true, minlength: 8,format: /^\d{3}-\d{3}-\d{4}$/},
})

PhonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Phonebook', PhonebookSchema)