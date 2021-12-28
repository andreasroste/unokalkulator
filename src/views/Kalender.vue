<template>
  <v-container>
    <h1>Spillkalender</h1>
    <v-btn to="/">Tilbake</v-btn>
        <v-card>
          <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
          <v-calendar
            ref="calendar"
            v-model="cal_model"
            :events="events"
            type="month"
            @click:event="selectEvent">
          </v-calendar>
          <h2>Spill</h2>
          <v-data-table
            :headers="table_spillere_headers"
            :items="selectedEvent.poengtavle"
            disable-pagination
            :mobile-breakpoint="0"
            disable-filtering
            hide-default-footer
            :items-per-page="-1">
          </v-data-table>
        </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: [],
      data_spiller: {},
      events: [],
      cal_model: '',
      selectedEvent: '',
      table_spillere_headers: [
        {text: "Navn", align: "left", sortable: true, value: "navn"},
        {text: "Poeng", align: "left", sortable: true, value: "poeng"},
      ]
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
            navn: spill.navn,
            poeng: sett.poeng
          });
        });
      });
      vm.data = data;

      vm.events = data.map(spill => {
        let start = (new Date(spill.dato));
        let slutt = (new Date(spill.dato)).setHours(start.getHours() + 1);
        return {
          name: spill.navn,
          start,
          slutt,
          poengtavle: spill.poengtavle
        }
      })

    });
  },
  methods: {
    selectEvent({ event }) {
      this.selectedEvent = event;
    }
  }
};
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
