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
    <h1>Fortell meg...</h1>
    Hvem skal være med?
    <v-text-field v-model="sok" append-icon="mdi-magnify" label="Søk"></v-text-field>
    <v-data-table
      :headers="headers"
      :items="registrerte_spillere"
      disable-pagination
      hide-default-footer
      :items-per-page="-1"
      :search="sok"
    >
      <template v-slot:item.leggtil="{ item }">
        <div
          v-if="!spillende_keys.includes(registrerte_spillere.indexOf(item))"
        >
          <v-btn
            @click="
              leggTilSpiller(item.navn, registrerte_spillere.indexOf(item))
            "
            small
            color="accent"
          >
            <v-icon small left>mdi-plus</v-icon>Legg til
          </v-btn>
        </div>
        <div v-if="spillende_keys.includes(registrerte_spillere.indexOf(item))">
          <v-btn
            @click="fjernSpiller(item.navn, registrerte_spillere.indexOf(item))"
            small
            color="secondary"
          >
            <v-icon small left>mdi-minus</v-icon>Fjern
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-btn color="primary" block style="margin-top: 20px" @click="startSpillet"
      >Begynn spillet</v-btn
    >

    <v-dialog v-model="ny_dialog" scrollable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Legge inn ny spiller</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="ny_dialog = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text style="padding-top: 20px">
          <v-text-field
            v-model="ny_navn"
            label="Navn på spilleren"
          ></v-text-field>
          <v-select
            :items="grupper"
            label="Gruppe"
            v-model="ny_gruppe"
          ></v-select>
          <v-checkbox label="Reglene for UNO er lest og forstått"></v-checkbox>
          <v-btn
            color="secondary"
            block
            href="https://docs.google.com/document/d/1xCRAahDAeSWZ9jZteKSjhIDmXHRHkmAAckj7r0vjez4"
            >De offisielle reglene for UNO</v-btn
          >
          <v-btn
            color="primary"
            block
            style="margin-top: 20px"
            @click="nySpiller()"
            >Legg til</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-overlay absolute :value="overlay">
      <h1>Laster inn...</h1>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      registrerte_spillere: [],
      spillende_keys: [],
      spillende: [],
      overlay: true,
      ny_dialog: false,
      ny_navn: "",
      grupper: [],
      sok: '',
      ny_gruppe: "",
      headers: [
        { text: "Navn", value: "navn", sortable: true, align: "start" },
        { text: "Gruppe", value: "gruppe", sortable: true },
        { text: "Legg til", value: "leggtil", sortable: true }
      ]
    };
  },
  mounted() {
    let vm = this;
    axios
      .get("/spillere.json?" + new Date().getTime())
      .then(e => {
        vm.registrerte_spillere = Object.values(e.data);
      })
      .then(() => {
        vm.overlay = false;
      });
    axios.get("/grupper.json?" + new Date().getTime()).then(e => {
      vm.grupper = Object.values(e.data);
    });
  },
  methods: {
    startSpillet() {
      localStorage.setItem("spillere", JSON.stringify(this.spillende));
      localStorage.setItem(
        "spillere_keys",
        JSON.stringify(this.spillende_keys)
      );
      localStorage.setItem("runder", "[]");
      this.$router.push("/spill");
    },
    leggTilSpiller(spiller, id) {
      this.spillende.push(spiller);
      this.spillende_keys.push(id);
      this.sok = '';
    },
    fjernSpiller(spiller, id) {
      this.spillende = this.spillende.filter(item => {
        return item !== spiller;
      });

      this.spillende_keys = this.spillende_keys.filter(item => {
        return item !== id;
      });
    },
    nySpiller() {
      let vm = this;

      axios
        .post("/admin.php", {
          mode: "add",
          navn: this.ny_navn,
          gruppe: this.ny_gruppe
        })
        .then(() => {
          vm.ny_dialog = false;
          vm.ny_navn = false;
          axios
            .get("/spillere.json?" + new Date().getTime())
            .then(e => {
              vm.registrerte_spillere = Object.values(e.data);
            })
            .then(() => {
              vm.overlay = false;
            });
        });
    }
  }
};
</script>
