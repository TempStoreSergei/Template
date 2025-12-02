import { reactive, computed } from "#imports";

export function useQuantity() {
  const quantityDigits = reactive({
    digit1: 0,
    digit2: 0,
    digit3: 0,
    digit4: 0,
    digit5: 0,
    digit6: 1,
  });

  const quantity = computed(() => {
    return (
      quantityDigits.digit1 * 10 +
      quantityDigits.digit2
    );
  });

  const weight = computed(() => {
    return (
      quantityDigits.digit3 * 1000 +
      quantityDigits.digit4 * 100 +
      quantityDigits.digit5 * 10 +
      quantityDigits.digit6
    );
  });

  const incrementDigit = (digitKey: keyof typeof quantityDigits) => {
    const maxValue = digitKey === 'digit1' ? 9 : 9;
    if (quantityDigits[digitKey] < maxValue) {
      quantityDigits[digitKey]++;
    }
  };

  const decrementDigit = (digitKey: keyof typeof quantityDigits) => {
    const minValue = (digitKey === 'digit6') ? 1 : 0;
    if (quantityDigits[digitKey] > minValue) {
      quantityDigits[digitKey]--;
    }
  };

  const resetQuantity = () => {
    quantityDigits.digit1 = 0;
    quantityDigits.digit2 = 0;
    quantityDigits.digit3 = 0;
    quantityDigits.digit4 = 0;
    quantityDigits.digit5 = 0;
    quantityDigits.digit6 = 1;
  };

  return {
    quantityDigits,
    quantity,
    weight,
    incrementDigit,
    decrementDigit,
    resetQuantity,
  };
}