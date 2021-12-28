<template>
  <v-container>
    <h1>UNO-kalkulator</h1>
    <v-btn class="mb" to="/start" block large color="green">Start nytt spill</v-btn>
    <v-btn class="mb" to="/kalender" block>Se kalenderen (beta)</v-btn>
    <v-btn class="mb" to="/statistikk" block>Se statistikk (beta)</v-btn>
    <br>
    <v-card>
      <v-card-title>Velkommen!</v-card-title>
      <v-card-text>
        Dette verktøyet er laget for å holde orden på poengene under uno-rundene, samt dokumentere spillene.<br>
        Verktøyet er under utvikling, og har absolutt forbedringspotensiale. Si gjerne i fra, enten på Github eller til meg direkte så vi får rettet feil og videreutviklet verktøyet!
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn color="primary" target="_blank" text href="https://github.com/andreasroste/unokalkulator/issues">Problemsporing (Github)</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped>
.v-btn.mb {
  margin-bottom: 20px;
}
</style>
