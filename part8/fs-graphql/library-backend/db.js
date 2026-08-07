import mongoose from 'mongoose'

const connectToDatabase = async (uri) => {
  console.log('Connecting to MongoDB...')
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB successfully')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectToDatabase