import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

export default function FiltersDrawer({
  handleValid,
}: {
  handleValid: (startDate: Date | null, stopDate: Date | null) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const btnRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Editer les filtres
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Editer les filtres</DrawerHeader>

          <DrawerBody>
            <Text>Dates</Text>
            <ReactDatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setStopDate(end);
              }}
              customInput={<Input />}
              startDate={startDate}
              endDate={stopDate}
              maxDate={new Date()}
              selectsRange
            />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleValid(startDate, stopDate)}
            >
              Valider
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
