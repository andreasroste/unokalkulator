<template>
  <v-container>
    <h1>Poeng for runde {{runde}}</h1>


    <v-text-field outlined v-for="(spiller, id) in spillere" :key="(id+1)" type="number" :label="spiller" v-model="poeng[id]"></v-text-field>

    <v-btn class="knapp" @click="lagre()" color="green" block>Legg inn</v-btn>
    <v-btn class="knapp" @click="$router.push('/spill')" block>Tilbake</v-btn>
  </v-container>
</template>

<style scoped>
.knapp {
    margin-top: 20px;
}
</style>

<script>
export default {
  name: "Home",
  data: () => {
      return {
          spillere: [],
          poeng: {},
          runde: 0
      }
  },
  mounted() {
      this.spillere = JSON.parse(localStorage.getItem('spillere'));
      this.runde = Number.parseInt(localStorage.getItem('runde'));
  },
  methods: {
      lagre() {
          if(!localStorage.getItem('poengtavle')) localStorage.setItem('poengtavle', '[]');
          let poengtavle = JSON.parse(localStorage.getItem('poengtavle'));
          poengtavle.push(this.poeng);
          localStorage.setItem('poengtavle', JSON.stringify(poengtavle));
          this.poeng = {};
          this.runde++;
          localStorage.setItem('runde', this.runde);
          this.$router.push('/spill');
      }
  }
};
</script>
