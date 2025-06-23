import mongoose from "mongoose";

// Replace this with your actual MongoDB connection string:
const MONGODB_URI = 'mongodb+srv://abrshmelkamu3:v1DyNH0TFNv8QUcr@cluster0.l1r1qbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

await mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Updated schema (for reference, not strictly needed for migration)
const productRequestSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true },
  isBulk: { type: Boolean, default: false },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);

try {
  const currentCollection = mongoose.connection.db.collection('productrequests');
  const documents = await currentCollection.find({}).toArray();

  console.log(`Found ${documents.length} documents to migrate`);

  for (const doc of documents) {
    const update = {
      $set: {
        requestedBy: doc.seller,
        isBulk: false, // Set all existing docs to normal (not bulk)
        status: doc.status === "approved" || doc.status === "rejected" ? doc.status : "pending"
      }
    };

    await currentCollection.updateOne(
      { _id: doc._id },
      update
    );

    console.log(`Updated document ${doc._id}`);
  }

  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
} finally {
  await mongoose.disconnect();
}