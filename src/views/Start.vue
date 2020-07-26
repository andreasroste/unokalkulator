<template>
  <v-container>
      <h1>Nytt spill</h1>
      <v-card>
          <v-card-text>
            <v-text-field v-for="nummer in antall" :key="nummer" v-model="spillere[nummer-1]" :placeholder="'Spiller ' + nummer"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="antall++" text>Legg til</v-btn>
            <v-btn @click="antall--" text>Fjern</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="lagre()" text color="green">Start spill</v-btn>
          </v-card-actions>
      </v-card>
  </v-container>
</template>

<style scoped>
h1 {
    margin-bottom: 10px;
}
</style>

<script>
export default {
  name: "Home",
  data: () => {
      return {
        antall: 2,
        spillere: []
      }
  },
  mounted() {
      if(localStorage.getItem('spillere')) this.spillere=JSON.parse(localStorage.getItem('spillere'));
  },
  methods: {
      lagre() {
          localStorage.setItem('spillere', JSON.stringify(this.spillere));
          localStorage.setItem('runde', "1");
          localStorage.setItem('poeng', "{}");
          this.$router.push('/spill');
      }
  }
};
</script>
