<template>
  <v-container>
    <h1>Heisann</h1>
    <v-btn to="/start" block large color="green">Start nytt spill</v-btn>
    <v-btn to="/statistikk">Se statistikk (beta)</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped>
.v-btn {
  margin-bottom: 20px;
}
</style>
