import { Container, Grid } from "@mantine/core";
import { LatestPositions } from "~/components/positions/LatestPositions";
import { PopularPositions } from "~/components/positions/PopularPositions";

export default function AppHome() {
  return (
    <Container size="xl" py="xl">
      <Grid >
        <Grid.Col span={{ base: 12, md: 6 }}>
          <LatestPositions />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PopularPositions />
        </Grid.Col>
      </Grid>
    </Container>
  );
}