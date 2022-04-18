<template>
  <v-container>
      <v-alert type="info" prominent>Denne siden er ikke ferdig. Ting som skal legges inn;
          <ul>
            <li>Antall seire</li>
            <li>Vinn/tap-prosent</li>
            <li>Annet...?</li>
          </ul>
      </v-alert>
    <h1>Statistikk</h1>
    <v-btn to="/">Tilbake</v-btn>
    <v-data-table
        :headers="table_spillere_headers"
        :items="spillere"
        disable-pagination
        disable-filtering
        :mobile-breakpoint="0"
        hide-default-footer
        :items-per-page="-1">
    </v-data-table>
    <v-card>
      <v-card-title>Maksimal poengsum</v-card-title>
      <v-card-text>
        Som vi vet, slutter alle spill ved 500 poeng eller mer. Her kan du se hvor langt over 500 som er registrert! <br>
        <b>Spiller:</b> {{max.spiller}} <br>
        <b>Poeng:</b> {{max.poeng}} <br>
        <b>Spillnavn:</b> {{max.spillnavn}} <br>
        <b>Dato:</b> {{max_date}} <br>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="loadMaxPoints">Last inn</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>Spillere</v-card-title>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th>Spiller</th>
              <th>Gruppe</th>
              <th>Graf</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="loadPlayerSparks">Last inn</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";

export default {
  data() {
    return {
      data: [],
      spillere: [],
      data_spiller: {},
      spark_data: {},
      events: [],
      cal_model: '',
      selectedEvent: '',
      table_spillere_headers: [
        {text: "Navn", align: "left", sortable: true, value: "navn"},
        {text: "Antall spill", align: "left", sortable: true, value: "antall_spill"},
      ],
      max: {spiller: "<ikke lastet inn>", poeng: "<ikke lastet inn>", spillnavn: "<ikke lastet inn>", dato: "<ikke lastet inn>"}
    };
  },
  computed:{
    max_date() {
      return dayjs(this.max.dato).locale("nb").format("dddd D. MMMM YYYY")
    }
  },
  filters: {
    formatdate(date){
      return dayjs(date).locale("nb").format("dddd D. MMMM YYYY")
    }
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

      vm.spillere = Object.keys(vm.data_spiller).map(navn => {
          return {
              navn,
              antall_spill: vm.data_spiller[navn].length,
              spill: vm.data_spiller[navn]
          }
      });

      vm.data = data;

      vm.events = data.map(spill => {
        let start = (new Date(spill.dato)).setHours(start.getHours() - 1);
        let slutt = (new Date(spill.dato));
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
    },
    loadMaxPoints() {
      let vm = this;
      axios.get('/spill.json').then((res) => {
        let allespill = res.data;
        let max = {spiller: "<ikke lastet inn>", poeng: 0, spillnavn: "<ikke lastet inn>", dato: "<ikke lastet inn>"};
        if(!Array.isArray(allespill)) console.error("allespill er ikke array");
        allespill.map(spill => {
          if(typeof spill === "object" && spill != null && Object.keys(spill).includes("poengtavle")){
            spill.poengtavle.map(poeng => {
              if(poeng.poeng > max.poeng){
                console.log(poeng);
                max = {spiller: poeng.navn, poeng: poeng["poeng"], spillnavn: spill.navn, dato: spill.dato};
              }
            })
          }
        })
        vm.max = max;
      });
    }
  }
};
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>
