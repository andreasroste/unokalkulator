<template>
  <v-container>
    <h1>UNO kalkulator</h1>
    <h2>Runde: {{runde}}</h2>
    <v-card class="my-5">
        <v-card-title>Spillere</v-card-title>
        <v-btn absolute top right rounded small @click="dialog_addplayer = true"><v-icon small>mdi-account-plus</v-icon></v-btn>
        <v-card-text>
            <v-simple-table>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Poeng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(spiller, id) in spillere" :key="id">
                        <td>
                            {{spiller}}
                            <v-chip label v-if="id == delerut">Deler ut</v-chip>
                            <v-chip label v-if="id == starter">Starter</v-chip>
                            <v-chip label color="red" v-if="poeng[id] >= 500">Tapt</v-chip>
                        </td>
                        <td>{{poeng[id]}}</td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card-text>
    </v-card>
    <v-btn class="my-5" block color="primary" @click="$router.push('/poeng')">Skriv inn poeng</v-btn>
    <v-card>
        <v-card-title>Tidligere runder</v-card-title>
        <v-card-text>
            <v-expansion-panels>
                <v-expansion-panel v-for="(runde, id) in poengtavle" :key="id">
                    <v-expansion-panel-header>Runde {{id+1}}</v-expansion-panel-header>
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
                                    <td>{{spillere[spillerid]}}</td>
                                    <td>{{poeng}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
    <v-card class="my-5">
        <v-card-title>Statistikk</v-card-title>
        <v-card-text>
            <v-simple-table>
                <tbody>
                    <tr>
                        <td>Estimerte runder</td>
                        <td>{{estimerterunder}}</td>
                    </tr>
                    <tr>
                        <td>Median</td>
                        <td>{{median}}</td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card-text>
    </v-card>
    <v-expansion-panels class="my-5">
        <v-expansion-panel>
            <v-expansion-panel-header>Slett spillet</v-expansion-panel-header>
            <v-expansion-panel-content>
                Er du sikker?
                <v-btn class="my-5" block color="red" @click="slettspill()">Ja, slett spillet</v-btn>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>



    <v-dialog v-model="dialog_addplayer">
        <v-card>
            <v-card-title>Legg til spiller</v-card-title>
            <v-card-text>
                <v-text-field label="Navn" v-model="nyspillernavn"></v-text-field>
                <v-text-field label="Poeng" :value="median"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="green" @click="leggtilnyspiller()">Legg til</v-btn>
                <v-btn text color="red" @click="dialog_addplayer = false">Lukk</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>

<script>
export default {
  name: "Home",
  data: () => {
      return {
          spillere: [],
          runde: 1,
          vinner: null,
          poengtavle: [],
          poeng: {},
          dialog_addplayer: false,
          nyspillernavn: ''
      }
  },
  mounted() {
      this.spillere = JSON.parse(localStorage.getItem('spillere'));
      this.runde = Number.parseInt(localStorage.getItem('runde'));
      this.poengtavle = JSON.parse(localStorage.getItem('poengtavle'));
      this.regnpoeng();
  },
  computed: {
    starter() {
        let startspiller_id = this.runde - Math.floor(this.runde / this.spillere.length) * this.spillere.length;
        return startspiller_id;
    },
    delerut() {
        let delerut_id = this.runde - Math.floor(this.runde / this.spillere.length) * this.spillere.length;
        if(delerut_id == 0) delerut_id = this.spillere.length;
        return delerut_id-1;
    },
    median(){
        let values = Object.values(this.poeng);
        if(Object.keys(this.poeng).length == 0) return 0;
        values.sort(function(a, b) {
            return a - b;
        });
        var mid = values.length / 2;
        return mid % 1 ? values[mid - 0.5] : Math.ceil((values[mid - 1] + values[mid]) / 2);
    },
    estimerterunder() {
        let values = Object.values(this.poeng);
        if(Object.keys(this.poeng).length == 0) return 0;
        values.sort(function(a, b) {
            return a - b;
        });
        let hoyestepoengsum = values[values.length-1];
        let spillersomliggerdaarligstan = Object.keys(this.poeng).find(key => this.poeng[key] == hoyestepoengsum);
        let spillerspoeng = this.poeng[spillersomliggerdaarligstan];
        let gjennomsnitt = spillerspoeng / (this.runde-1);
        return Math.floor((500-spillerspoeng)/gjennomsnitt);
    }
  },
  methods: {
    regnpoeng() {
        let result = {}
        if(this.poengtavle == null){
            for(let i = 0; i < this.spillere.length; i++){
                result[i] = 1;
            }
            return result;
        }

        this.poengtavle.map(runde => {
            let spillere = Object.keys(runde);
            for(let i = 0; i < spillere.length; i++){
                let poeng = runde[spillere[i]];
                if(!result[i]){
                    result[i] = Number.parseInt(poeng);
                }else{
                    result[i] += Number.parseInt(poeng);
                }
            }
        });
        this.poeng = result;
    },
    leggtilnyspiller() {
        if(this.runde != 1){
            this.poengtavle[this.runde-2][this.spillere.length-1] = this.median;
            localStorage.setItem('poengtavle', JSON.stringify(this.poengtavle));
        }

        this.spillere.push(this.nyspillernavn);
        localStorage.setItem('spillere', JSON.stringify(this.spillere));
        this.nyspillernavn = '';
        this.regnpoeng();
    },
    slettspill() {
        localStorage.clear();
        this.$router.push('/');
    }
  }
};
</script>
