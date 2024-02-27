import { Box, Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaTaxi } from "react-icons/fa";

const Index = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("yards");
  const [extraPassengers, setExtraPassengers] = useState(0);
  const [children, setChildren] = useState(0);
  const [luggage, setLuggage] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soiled, setSoiled] = useState(false);
  const [costPerMile, setCostPerMile] = useState(0);

  const calculateFare = (excludeStartPrice = false) => {
    let fare;
    const dateTime = new Date(`${date}T${time}`);
    const isChristmasPeriod = dateTime.getMonth() === 11 && (dateTime.getDate() === 24 || dateTime.getDate() === 31);
    const isNewYearPeriod = dateTime.getMonth() === 0 && dateTime.getDate() === 1;
    const isBoxingDay = dateTime.getMonth() === 11 && dateTime.getDate() === 26;
    const isBankHoliday = dateTime.getDay() === 0 || dateTime.getDay() === 6;

    // Determine Tariff
    let tariff;
    if (isChristmasPeriod || isNewYearPeriod || isBoxingDay) {
      tariff = 4;
    } else if (isBankHoliday || dateTime.getDay() === 0 || dateTime.getDay() === 6 || (dateTime.getHours() >= 21 && dateTime.getHours() <= 23)) {
      tariff = 2;
    } else if (dateTime.getHours() >= 0 && dateTime.getHours() <= 5) {
      tariff = 3;
    } else {
      tariff = 1;
    }

    // Convert miles to yards if necessary
    const calculatedDistance = distanceUnit === "miles" ? parseFloat(distance) * 1760 : parseInt(distance);

    const startPrice = {
      1: 2.6,
      2: 2.6,
      3: 3.2,
      4: 5.2,
    };
    const startDistance = {
      1: 168,
      2: 130,
      3: 130,
      4: 130,
    };

    // Calculate base fare excluding the start price if requested
    const baseFare = Math.ceil((calculatedDistance - startDistance[tariff]) / startDistance[tariff]) * 0.2;
    fare = excludeStartPrice ? baseFare : startPrice[tariff] + baseFare;

    // Add extras
    fare += extraPassengers * 0.3;
    fare += Math.floor(children / 2) * 0.3;
    fare += luggage * 0.3;
    fare += cycles * 0.9;
    fare += soiled ? 50 : 0;

    return fare.toFixed(2);
  };

  const calculateCostPerMile = (excludeStartPrice = false) => {
    if (distance && distanceUnit) {
      const miles = distanceUnit === "miles" ? parseFloat(distance) : parseFloat(distance) / 1760;
      const totalFare = parseFloat(calculateFare());
      const fareWithoutStartPrice = parseFloat(calculateFare(true));
      if (miles > 0) {
        const cost = excludeStartPrice ? (totalFare - fareWithoutStartPrice) / miles : totalFare / miles;
        setCostPerMile(cost.toFixed(2));
      }
    }
  };

  useEffect(() => {
    calculateCostPerMile(true);
  }, [distance, distanceUnit]);

  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center" display="flex" justifyContent="space-between">
        <Box>
          <FaTaxi size="3rem" />
          <Text fontSize="2xl" fontWeight="bold" mb={6}>
            Taxi Tariff Calculator
          </Text>
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {`Cost per Mile: £${costPerMile}`}
          </Text>
        </Box>
      </Box>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Date of Journey</FormLabel>
          <Input type="date" onChange={(e) => setDate(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Time of Journey</FormLabel>
          <Input type="time" onChange={(e) => setTime(e.target.value)} />
        </FormControl>
        <FormControl as="fieldset" isRequired>
          <FormLabel>Distance</FormLabel>
          <RadioGroup defaultValue="yards" mb={4} onChange={(value) => setDistanceUnit(value)}>
            <Stack direction="row">
              <Radio value="yards">Yards</Radio>
              <Radio value="miles">Miles</Radio>
            </Stack>
          </RadioGroup>
          <NumberInput min={0} onChange={(valueString) => setDistance(valueString)}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Extra Adult Passengers</FormLabel>
          <NumberInput min={0} onChange={(valueString) => setExtraPassengers(parseInt(valueString))}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Children (3-12 years)</FormLabel>
          <NumberInput min={0} onChange={(valueString) => setChildren(parseInt(valueString))}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Luggage, Prams, Dogs</FormLabel>
          <NumberInput min={0} onChange={(valueString) => setLuggage(parseInt(valueString))}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Cycles</FormLabel>
          <NumberInput min={0} onChange={(valueString) => setCycles(parseInt(valueString))}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl as="fieldset">
          <FormLabel as="legend">Soiled Vehicle</FormLabel>
          <RadioGroup defaultValue="no">
            <Stack direction="row">
              <Radio value="yes" onChange={() => setSoiled(true)}>
                Yes
              </Radio>
              <Radio value="no" onChange={() => setSoiled(false)}>
                No
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <Button colorScheme="yellow" onClick={() => alert(`Total Fare: £${calculateFare()}`)}>
          Calculate Fare
        </Button>
      </Stack>
    </Container>
  );
};

export default Index;
