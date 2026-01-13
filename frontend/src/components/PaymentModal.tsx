import { useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { plansService } from '@/api'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  planName: string
  onSuccess: () => void
}

function PaymentForm({ amount, onSuccess, onClose }: { amount: number, onSuccess: () => void, onClose: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/plans',
      },
      redirect: 'if_required',
    })

    if (submitError) {
      setError(submitError.message || 'An error occurred')
      setProcessing(false)
    } else {
      // Payment successful
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-3 justify-end mt-6">
        <Button variant="outline" onClick={onClose} type="button">
          Cancelar
        </Button>
        <Button disabled={!stripe || processing} isLoading={processing} type="submit">
          Pagar {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount / 100)}
        </Button>
      </div>
    </form>
  )
}

export function PaymentModal({ isOpen, onClose, amount, planName, onSuccess }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Fetch client secret when modal opens
  if (isOpen && !clientSecret) {
    plansService.createPaymentIntent(amount, 'brl')
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error('Failed to init payment', err))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pagamento - Plano ${planName}`}
      description="Insira os dados do seu cartão para finalizar a assinatura"
    >
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      ) : (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </Modal>
  )
}
