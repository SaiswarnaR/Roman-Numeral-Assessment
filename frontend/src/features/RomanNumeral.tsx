import { useState } from 'react';
import {
  View,
  TextField,
  Button,
  Flex,
  Heading,
  Text,
  Content,
  Divider,
  ProgressCircle,
  Form,
} from '@adobe/react-spectrum';
import { useGetRomanNumeral } from '../hooks/useGetRomanNumeral';

const RomanNumeral = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [number, setNumber] = useState<number | undefined>(undefined);

  const { data, isLoading, isError, error } = useGetRomanNumeral(number);

  const handleSubmit = () => {
    const parsedValue = parseInt(inputValue, 10);
    if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue < 4000) {
      setNumber(parsedValue);
    }
  };

  const isValidInput = () => {
    const parsedValue = parseInt(inputValue, 10);
    return !isNaN(parsedValue) && parsedValue > 0 && parsedValue < 4000;
  };

  return (
    <View
      borderRadius="medium"
      padding="size-250"
      width="size-4600"
      borderWidth="thin"
      borderColor="dark"
    >
      <Flex direction="column" gap="size-150">
        <Heading level={3}>Roman Numeral Converter</Heading>
        <Divider size="S" />

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            label="Enter a number (1-3999)"
            value={inputValue}
            onChange={setInputValue}
            type="number"
            width="100%"
          />
          <Button
            variant="accent"
            marginTop="size-150"
            isDisabled={!isValidInput() || isLoading}
            onPress={handleSubmit}
            width="100%"
          >
            Convert to Roman Numeral
          </Button>
        </Form>

        {isLoading && (
          <Flex justifyContent="center" marginTop="size-150">
            <ProgressCircle aria-label="Converting..." isIndeterminate />
          </Flex>
        )}

        {isError && (
          <Text marginTop="size-150" UNSAFE_style={{ color: 'red' }}>
            Error: {(error as Error)?.message || 'An error occurred'}
          </Text>
        )}

        {data && !isLoading && !isError && (
          <Content marginTop="size-150">
            <Divider size="S" />
            <Flex direction="column" gap="size-100" marginTop="size-150">
              <Flex justifyContent="space-between">
                <Text>Roman Numeral:</Text>
                <Text>{data.output}</Text>
              </Flex>
            </Flex>
          </Content>
        )}
      </Flex>
    </View>
  );
};

export default RomanNumeral;
