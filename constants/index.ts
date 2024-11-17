import { Receipt } from "@/types";

export const RECEIPT_EXAMPLE: Receipt = {
    summary: "Grocery purchase at Sprouts with fresh produce",
    metadata: {
        merchant_name: "Sprouts Farmers Market",
        merchant_address: {
            street: "3030 Harbor Blvd. #D",
            city: "Costa Mesa",
            state: "CA",
            zip: "92626"
        },
        merchant_phone: "(714)751-6399",
        date: "2018-05-05",
        time: "15:41",
        receipt_id: "584472"
    },
    transaction: {
        subtotal: 17.87,
        tax: null,
        tip: null,
        total: 17.87,
        payment_method: {
            type: "DEBIT",
            entry_method: "CHIP",
            last_digits: "7857"
        }
    },
    items: [
        {
            name: "HASS AVOCADOS",
            quantity: 6,
            unit_price: 0.33,
            total_price: 2.00,
            category: "PRODUCE"
        }
    ],
    status: "PROCESSED",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};