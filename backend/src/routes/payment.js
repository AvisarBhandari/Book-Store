import express from "express";
import crypto from "crypto";

const router = express.Router();

/**
 * Generate eSewa test payment request
 */
router.post("/esewa-request", async (req, res) => {
  try {
    const { bookId, amount } = req.body;
    if (!bookId || !amount) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    // Format amounts as strings with 2 decimal places
    const amountStr = Number(amount).toFixed(2);
    const tax_amount = "10.00";
    const product_service_charge = "0.00";
    const product_delivery_charge = "0.00";

    const total_amount = (
      Number(amountStr) +
      Number(tax_amount) +
      Number(product_service_charge) +
      Number(product_delivery_charge)
    ).toFixed(2);

    const product_code = process.env.PRODUCT_CODE;
    const transaction_uuid = `${bookId}-${Date.now()}`;
    const signed_field_names = "total_amount,transaction_uuid,product_code";

    const secretKey = process.env.ESEWA_SECRET_KEY;

    const signatureStr = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureStr)
      .digest("base64");

    // Trim FRONTEND_URL to remove accidental spaces
    const frontendUrl = process.env.FRONTEND_URL?.trim();

    // Debug logs
    console.log(
      "SUCCESS URL =>",
      `${frontendUrl}/?paymentStatus=success&bookId=${bookId}`,
    );
    console.log(
      "FAILURE URL =>",
      `${frontendUrl}/?paymentStatus=failure&bookId=${bookId}`,
    );

    res.json({
      amount: amountStr,
      tax_amount,
      product_service_charge,
      product_delivery_charge,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature,
      success_url: `${frontendUrl}/?paymentStatus=success&bookId=${bookId}`,
      failure_url: `${frontendUrl}/?paymentStatus=failure&bookId=${bookId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate payment request" });
  }
});

export default router;
