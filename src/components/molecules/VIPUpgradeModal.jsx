import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { settingsService } from '@/services/api/settingsService';

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe('pk_test_your_publishable_key_here');

const VIPUpgradeModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

  const loadPlans = async () => {
    try {
      const plansData = await settingsService.getSubscriptionPlans();
      setPlans(plansData);
    } catch (error) {
      toast.error('Failed to load subscription plans');
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinueToPayment = () => {
    setShowPayment(true);
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="Crown" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upgrade to VIP</h2>
                  <p className="text-sm text-gray-600">Unlock premium wellness content</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            {!showPayment ? (
              <>
                {/* Subscription Plans */}
                <div className="space-y-4 mb-6">
                  {plans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedPlan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          {plan.popular && (
                            <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                          <div className="text-sm text-gray-600">/{plan.period}</div>
                        </div>
                      </div>
                      {plan.savings && (
                        <div className="text-sm text-green-600 font-medium mb-2">
                          Save ${plan.savings} per year
                        </div>
                      )}
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">VIP Benefits</h3>
                  <div className="space-y-2">
                    {[
                      'Unlimited access to premium content',
                      'Exclusive wellness guides and courses',
                      'Personalized meditation sessions',
                      'Priority customer support',
                      'Advanced progress tracking',
                      'Ad-free experience',
                      'Early access to new features'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <ApperIcon name="Check" size={16} className="text-green-500" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinueToPayment}
                  className="w-full"
                  disabled={!selectedPlan}
                >
                  Continue to Payment
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  By continuing, you agree to our Terms of Service and Privacy Policy. 
                  Subscription will auto-renew unless cancelled.
                </p>
              </>
            ) : (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  plan={selectedPlanData}
                  user={user}
                  onSuccess={onSuccess}
                  onBack={() => setShowPayment(false)}
                  loading={loading}
                  setLoading={setLoading}
                />
              </Elements>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PaymentForm = ({ plan, user, onSuccess, onBack, loading, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.name,
          email: user?.email,
        },
      });

      if (paymentError) {
        setError(paymentError.message);
        setLoading(false);
        return;
      }

      // Process the upgrade
      await settingsService.processVIPUpgrade({
        planId: plan.id,
        paymentMethodId: paymentMethod.id,
        userId: user?.Id
      });

      toast.success('Payment successful! Welcome to VIP! 🎉');
      onSuccess();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{plan?.name}</h3>
            <p className="text-sm text-gray-600">{plan?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">${plan?.price}</div>
            <div className="text-sm text-gray-600">/{plan?.period}</div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Details
        </label>
        <div className="p-3 border border-gray-300 rounded-xl">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <ApperIcon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Subscribe for $${plan?.price}/${plan?.period}`
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <ApperIcon name="Shield" size={14} />
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
};

export default VIPUpgradeModal;