<template>
  <div class="center">
    <h1>UNO kalkulator</h1>
    <v-btn block color="primary" @click="$router.push('/start')">Start</v-btn>
    <p class="text-caption my-8">Andreas Røste &copy; 2020</p>
  </div>
</template>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  min-width: 50vw;
  min-height: 30vh;
  text-align: center;
}
.center > h1 {
  margin-bottom: 30px;
}
</style>

<script>
export default {
  name: "Home"
};
</script>
