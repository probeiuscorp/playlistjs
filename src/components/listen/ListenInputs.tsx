import React, { PropsWithChildren } from 'react';
import { Flex, Button, FormLabel, Input, NumberInput, NumberInputField, Select, Switch, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from '@chakra-ui/react';
import { InputDesc, useController } from './useController';
import { stable } from ':/util/stable';
import { Behavior } from ':/lib/execute/testable';
import { BehaviorConsumer } from ':/hooks/useBehavior';

function VerticalStack({ children }: PropsWithChildren) {
  return (
    <FormLabel display="flex" flexDir="column" gap={0.5} mb={0}>
      {children}
    </FormLabel>
  );
}

const track = stable((input: InputDesc & { type: 'slider'}) => Behavior.exec(input.initial));
export function ListenInputs({ controller }: {
  controller: ReturnType<typeof useController>
}) {
  const inputs = controller.inputs;
  if (inputs.length === 0) return null;

  function send(input: InputDesc, value: number | boolean | string | undefined) {
    controller.sendMessage({
      type: 'input-change',
      id: input.id,
      value,
    });
  }

  return (
    <Flex flexWrap="wrap" alignItems="center" pb={6} columnGap={3} rowGap={1}>
      {inputs.map((input) => input.type === 'button' ? (
        <Button onClick={() => send(input, undefined)} key={input.id}>
          {input.label}
        </Button>
      ) : input.type === 'boolean' ? (
        <FormLabel key={input.id} display="flex" gap={1} alignItems="center" mb={0}>
          <Switch
            defaultChecked={input.initial}
            onChange={(e) => {
              send(input, e.currentTarget.checked);
            }}
          />
          {input.label}
        </FormLabel>
      ) : input.type === 'number' ? (
        <VerticalStack key={input.id}>
          {input.label}
          <NumberInput width={200} defaultValue={input.initial} onChange={(_, value) => {
            if (!isNaN(value)) {
              send(input, value);
            }
          }}>
            <NumberInputField />
          </NumberInput>
        </VerticalStack>
      ) : input.type === 'slider' ? (
        <VerticalStack key={input.id}>
          <BehaviorConsumer behavior={track(input)[0]}>
            {current => <span>
              {input.label}{' '}
              <span style={{ fontSize: 'small' }}>
                ({current.toPrecision(3)})
              </span>
            </span>}
          </BehaviorConsumer>
          <Slider
            width={140}
            min={input.min}
            max={input.max}
            step={input.step ?? 0.001}
            defaultValue={input.initial}
            onChange={(value) => track(input)[1](value)}
            onChangeEnd={(value) => send(input, value)}
          >
            {[input.min, (input.min + input.max) / 2, input.max].map((value, i) => (
              <SliderMark
                value={value}
                key={i}
                mt={2}
                fontSize="xs"
                transform={`translateX(${[50, -50, -150][i]}%)`}
              >
                {value}
              </SliderMark>
            ))}
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </VerticalStack>
      ) : input.type === 'select' ? (
        <VerticalStack key={input.id}>
          {input.label}
          <Select width={200} defaultValue={input.initial} onChange={(e) => {
            send(input, e.currentTarget.value);
          }}>
            {input.options.map((label, i) => (
              <option value={label} key={i}>
                {label}
              </option>
            ))}
          </Select>
        </VerticalStack>
      ) : (
        <VerticalStack key={input.id}>
          {input.label}
          <Input width={200} defaultValue={input.initial} onChange={(e) => {
            send(input, e.currentTarget.value);
          }} />
        </VerticalStack>
      ))}
    </Flex>
  );
}
