import express from 'express';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post('/clientKey', async(req, res)=>{
    const {price} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      automatic_payment_methods: {enabled: true},
    });
    
    res.status(201).json(paymentIntent)
})
router.post('/cancel', async(req, res)=>{
    const {id} = req.body;
    await stripe.paymentIntents.cancel(id);

    res.json('Cancelled the payment')
})

router.post('/alipay', async(req, res)=>{
  const {price} = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ['alipay'],
    amount: price,
    currency: 'usd',
  });

  res.status(201).json({client_secret: paymentIntent.client_secret})
})

export default router