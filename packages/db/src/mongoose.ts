import mongoose from "mongoose"

let isConnected = false

export async function connectMongo(uri: string) {
  if (isConnected) return mongoose

  mongoose.set("strictQuery", true)

  await mongoose.connect(uri)

  isConnected = true

  console.log("MongoDB connected")

  return mongoose
}

export async function disconnectMongo() {
  await mongoose.disconnect()
  isConnected = false
}