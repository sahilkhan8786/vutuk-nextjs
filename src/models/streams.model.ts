// models/Stream.ts
import  { Schema, model, models } from 'mongoose';

const StreamSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
});

 const Stream = models.Stream || model('Stream', StreamSchema);

 export default Stream