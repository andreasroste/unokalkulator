<template>
  <v-container>
    <h1>Statistikk</h1>
    <v-btn to="/">Tilbake</v-btn>
    <v-tabs v-model="tab">
      <v-tab>Spill</v-tab>
      <v-tab>Spillere</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card v-for="(spill, id) in data" :key="id">
          <v-card-title>Spill {{ spill.dato }}</v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Poeng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(spiller, key) in spill.poengtavle" :key="key">
                  <td>{{ spiller.navn }}</td>
                  <td>{{ spiller.poeng }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          v-for="(spiller, navn) in Object.values(data_spiller)"
          :key="navn"
        >
          <v-card-title>{{ Object.keys(data_spiller)[navn] }}</v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Poeng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(spill, key) in spiller" :key="key">
                  <td>{{ spill.dato }}</td>
                  <td>{{ spill.poeng }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: [],
      data_spiller: {},
      tab: null
    };
  },
  mounted() {
    let vm = this;
    axios.get("/spill.json").then(res => {
      let data = res.data.filter(n => n != null && "dato" in n).reverse();
      data.forEach(spill => {
        spill.poengtavle.forEach(sett => {
          if (vm.data_spiller[sett.navn] == undefined)
            vm.data_spiller[sett.navn] = [];
          vm.data_spiller[sett.navn].push({
            dato: spill.dato,
            poeng: sett.poeng
          });
        });
      });
      vm.data = data;
    });
  }
};
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
