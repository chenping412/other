<template>
  <div class="intl-tel-input allow-dropdown">
    <div class="flag-container" v-clickoutside="closeSubMenu">
      <div class="selected-flag" @click="hideSubMenu = !hideSubMenu"
           :title="currentData.name + ': +' + currentData.dialCode">
        <div :class="'iti-flag ' + currentData.code"></div>
        <div class="iti-arrow"></div>
      </div>
      <ul class="country-list" v-show="!hideSubMenu">
        <li @click="currentCode = item.code;hideSubMenu = true;setCountry(item);" v-for="item in frontCountriesArray"
            :class="'country ' + (item.code == currentCode ? 'highlight' : '')">
          <div class="flag-box">
            <div :class="'iti-flag ' + item.code"></div>
          </div>
          <span class="country-name">{{ item.name }}</span>
          <span class="dial-code">+{{ item.dialCode }}</span>
        </li>
        <li class="divider"></li>
        <li @click="currentCode = item.code;hideSubMenu = true;setCountry(item);" v-for="item in countriesArray"
            :class="'country ' + (item.code == currentCode ? 'highlight' : '')">
          <div class="flag-box">
            <div :class="'iti-flag ' + item.code"></div>
          </div>
          <span class="country-name">{{ item.name }}</span>
          <span class="dial-code">+{{ item.dialCode }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import clickoutside from 'element-ui/src/utils/clickoutside'
  import countries from './countries.js'
  export default (function () {


    return {
      directives: { clickoutside },
      props: {
        toFront: {
          type: Array,
          default () {
            return []
          }
        },
        countryCode: {
          type: String,
          default: Object.keys(countries)[0],

          validator (code) {
            var clearCode = String(code).toLowerCase()
            return !!countries[clearCode]
          }
        }
      },
      data () {
        return {
          currentCode: this.countryCode,
          hideSubMenu: true
        }
      },
      computed: {
        currentData () {
          return countries[this.currentCode]
        },

        frontCountriesArray () {
          const toFrontCodes = {}
          this.toFront.forEach((code) => {
            const stringCode = String(code)
            const needObj = countries[stringCode]

            if (needObj) {
              toFrontCodes[stringCode] = needObj
            }
          })

          return toFrontCodes
        },

        countriesArray () {
          const countryCopie = {...countries}

          this.toFront.forEach((code) => {
            delete countryCopie[code]
          })
          return countryCopie
        }
      },
      mounted: function () {
        this.$emit('excountry', countries[this.countryCode])
      },
      watch: {
        countryCode: function (newCode) {
          this.setCountry(countries[newCode])
        }
      },
      methods: {
        setCountry: function (item) {
          this.currentCode = item.code
          this.toFront.push(String(item.code))
          this.$emit('excountry', item)
        },
        closeSubMenu(){
          this.hideSubMenu=true;
        }
      }
    }
  }())
</script>

<style scoped lang="scss">
  @import "intl.css";

  .intl-tel-input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    color: #666;
    font-size: 14px;
    .country-list {
      width: 420px;
      margin-top: 2px;
    }
  }
</style>
