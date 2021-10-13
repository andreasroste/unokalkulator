<template>
  <v-container>
    <v-btn
      absolute
      right
      fab
      dark
      icon
      color="primary"
      @click="ny_dialog = true"
      ><v-icon>mdi-account-plus</v-icon></v-btn
    >
    <h1>UNO</h1>
    <v-btn
      color="primary"
      block
      style="margin: 20px 0"
      @click="poengdialog = true"
      >Legg inn poeng</v-btn
    >
    <v-card>
      <v-simple-table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(spiller, id) in spillere" :key="id">
            <td>{{ spiller }}</td>
            <td>{{ poeng[id] }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <v-card style="margin-top: 30px">
      <v-card-title>Regler</v-card-title>
      <v-card-text>
        <v-btn
          color="secondary"
          block
          href="https://docs.google.com/document/d/1xCRAahDAeSWZ9jZteKSjhIDmXHRHkmAAckj7r0vjez4"
          >De offisielle reglene for UNO</v-btn
        >
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Runder</v-card-title>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel v-for="(runde, key) in runder" :key="key">
            <v-expansion-panel-header
              >Runde {{ key + 1 }}</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Navn</th>
                    <th>Poeng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(poeng, spillerid) in runde" :key="spillerid">
                    <td>{{ spillere[spillerid] }}</td>
                    <td>{{ poeng }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <v-dialog v-model="vunnetdialog">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Spillet er slutt</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="padding-top: 20px">
          <h1>Gratulerer med seieren, {{ ledendeSpiller }}</h1>
          <h3>Poengtavle</h3>
          <v-simple-table>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Poeng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(spiller, id) in spillere" :key="id">
                <td>{{ spiller }}</td>
                <td>{{ poeng[id] }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn v-if="ikkelagret" block @click="lagreSpill()"
            >Lagre og arkivèr spill</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="poengdialog" scrollable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Legge inn poeng</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="poengdialog = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text style="padding-top: 20px">
          <v-text-field
            v-for="(spiller, id) in spillere"
            :key="id"
            :label="spiller"
            type="number"
            v-model="poeng_runde[id]"
            :rules="[
              () =>
                (/^-?\d+$/.test(poeng_runde[id]) && poeng_runde[id] != '') ||
                'Dette er ikke tall!'
            ]"
          ></v-text-field>
          <v-btn
            color="primary"
            block
            style="margin: 20px 0"
            @click="lagreRunde()"
            >Legg inn og begynn ny runde</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="ny_dialog" scrollable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Legg til spiller under spill</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="ny_dialog = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text style="padding-top: 20px">
          <v-simple-table>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Deltagelse</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(spiller, id) in registrerte_spillere" :key="id">
                <td>{{ spiller }}</td>
                <td v-if="!spillende_keys.includes(id)">
                  <v-btn
                    @click="leggTilSpiller(spiller, id)"
                    small
                    color="accent"
                    ><v-icon small left>mdi-plus</v-icon>Legg til</v-btn
                  >
                </td>
                <td v-if="spillende_keys.includes(id)">
                  <v-btn small disabled color="secondary"
                    ><v-icon small left>mdi-minus</v-icon>Fjern</v-btn
                  >
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      spillere: {},
      poengdialog: false,
      poeng_runde: {},
      runder: [],
      ikkelagret: true,
      vunnetdialog: false,
      ny_dialog: false,
      registrerte_spillere: [],
      spillende: [],
      spillende_keys: []
    };
  },
  mounted() {
    this.spillere = Object.assign(
      {},
      JSON.parse(localStorage.getItem("spillere"))
    ); // Lager et objekt av spillerarrayen fra localstorage, og setter det i "spillere"
    this.spillende = JSON.parse(localStorage.getItem("spillere"));
    this.spillende_keys = JSON.parse(localStorage.getItem("spillere_keys"));
    if (localStorage.getItem("runder"))
      this.runder = JSON.parse(localStorage.getItem("runder"));

    let vm = this;

    axios
      .get("/spillere.json?" + new Date().getTime())
      .then(e => {
        vm.registrerte_spillere = Object.values(e.data);
      })
      .then(() => {
        vm.overlay = false;
      });
  },
  methods: {
    lagreRunde() {
      this.runder.push(this.poeng_runde);
      this.poeng_runde = {};
      this.poengdialog = false;
      localStorage.setItem("runder", JSON.stringify(this.runder));

      if (Math.max(...Object.values(this.poeng)) >= 500)
        this.vunnetdialog = true;
    },
    lagreSpill() {
      let poengtavle = [];
      let poeng = {};
      let vm = this;
      Object.keys(this.spillere).forEach(key => {
        poeng[key] = 0;
        vm.runder.forEach(runde => {
          poeng[key] += parseInt(runde[key]);
        });
        poengtavle.push({
          navn: vm.spillere[key],
          poeng: poeng[key]
        });
      });

      let spill = {
        dato: new Date(),
        poengtavle
      };

      axios
        .post("/lagrespill.php", {
          spill: JSON.stringify(spill)
        })
        .then(() => {
          vm.ikkelagret = false;
          vm.vunnetdialog = false;
        });
    },
    leggTilSpiller(spiller, id) {
      this.spillende.push(spiller);
      this.spillende_keys.push(id);

      // Finn median
      let poengarr = Object.values(this.poeng);
      poengarr.sort();
      let mid = Math.ceil(poengarr.length / 2);
      let median =
        poengarr.length % 2 == 0
          ? (poengarr[mid] + poengarr[mid - 1]) / 2
          : poengarr[mid - 1];
      console.log("Median", median);

      let nyspillerkey = Object.keys(this.spillere).length;

      console.log("nyspillerkey", nyspillerkey);
      this.spillere[nyspillerkey] = spiller;
      console.log("this.spillere", this.spillere);

      let nyrundemednyspiller = {};

      Object.keys(this.spillere).forEach(key => {
        if (key == nyspillerkey) nyrundemednyspiller[key] = median;
        else nyrundemednyspiller[key] = 0;
      });

      console.log("nyrundemednyspiller", nyrundemednyspiller);

      this.runder.push(nyrundemednyspiller);

      localStorage.setItem("runder", JSON.stringify(this.runder));
      localStorage.setItem("spillere", JSON.stringify(this.spillende));
      localStorage.setItem(
        "spillere_keys",
        JSON.stringify(this.spillende_keys)
      );
    },
    fjernSpiller(spiller, id) {
      this.spillende = this.spillende.filter(item => {
        return item !== spiller;
      });

      this.spillende_keys = this.spillende_keys.filter(item => {
        return item !== id;
      });
    }
  },
  computed: {
    poeng() {
      let poeng = {};
      let vm = this;
      Object.keys(this.spillere).forEach(key => {
        poeng[key] = 0;
        vm.runder.forEach(runde => {
          if (key in runde) {
            poeng[key] += parseInt(runde[key]);
          } else {
            poeng[key] += 0;
          }
        });
      });
      return poeng;
    },
    ledendeSpiller() {
      let poeng = {};
      let vm = this;
      Object.keys(this.spillere).forEach(key => {
        poeng[key] = 0;
        vm.runder.forEach(runde => {
          if (key in runde) {
            poeng[key] += parseInt(runde[key]);
          } else {
            poeng[key] += 0;
          }
        });
      });
      let ledendeSpillerID = Object.keys(poeng).reduce((a, b) =>
        poeng[a] < poeng[b] ? a : b
      );
      return this.spillere[ledendeSpillerID];
    }
  }
};
</script>
