import RomanNumeral from './features/RomanNumeral';
import { defaultTheme, Provider, Flex, View, Grid } from '@adobe/react-spectrum';

function App() {
  return (
    <Provider theme={defaultTheme} height="100vh">
      <Grid
        areas={['content']}
        columns={['1fr']}
        rows={['auto']}
        height="100%"
        UNSAFE_style={{ margin: 0, padding: 0 }}
      >
        <View gridArea="content" height="100vh" UNSAFE_style={{ margin: 0, padding: 0 }}>
          <Flex direction="column" height="100%" justifyContent="center" alignItems="center">
            <RomanNumeral />
          </Flex>
        </View>
      </Grid>
    </Provider>
  );
}

export default App;
