import { Badge, Flex, Spinner, Text, ThemeTypings } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import fetchTempo from '../../actions/fetchTempo';

function tempoToString(tempoStr: string): string {
  switch (tempoStr) {
    case 'TEMPO_BLEU':
      return 'Bleu';
    case 'TEMPO_BLANC':
      return 'Blanc';
    case 'TEMPO_ROUGE':
      return 'Rouge';
    default:
      return 'Erreur';
  }
}

function getTempoColor(tempoStr: string): ThemeTypings['colorSchemes'] {
  switch (tempoStr) {
    case 'TEMPO_BLEU':
      return 'blue';
    case 'TEMPO_BLANC':
      return 'gray';
    case 'TEMPO_ROUGE':
      return 'red';
    default:
      return 'red';
  }
}

function getTempo(
  isLoading: boolean,
  tempo: string | undefined,
): JSX.Element | null {
  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if ((!isLoading && !tempo) || !tempo) {
    return <Badge colorScheme="red">Erreur</Badge>;
  }

  return (
    <Badge variant="solid" colorScheme={getTempoColor(tempo)}>
      {tempoToString(tempo)}
    </Badge>
  );
}

export default function Tempo() {
  const { isLoading, data } = useQuery('tempo', fetchTempo);

  return (
    <Flex gap={6}>
      <Text as="span">Tempo J : {getTempo(isLoading, data?.Today)}</Text>
      <Text as="span">Tempo J+1 : {getTempo(isLoading, data?.Tomorrow)}</Text>
    </Flex>
  );
}
