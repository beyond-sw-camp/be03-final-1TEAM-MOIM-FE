<template>
    <div>
    </div>
</template>

<script>
// import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


export default {
    created(){
        console.log(this.$route.query);
        const accessToken = this.$route.query.accessToken;
        const refreshToken = this.$route.query.refreshToken;
        if (accessToken && refreshToken){
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            const decodedAccessToken = jwtDecode(accessToken);
            localStorage.setItem('expiredTime', decodedAccessToken.exp);
            this.$router.push({ name: 'MainPage'});
        } else {
            window.alert("로그인에 실패하였습니다.");
        }
    },
    mounted(){
        // URL에서 인증 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        console.log(authCode);
        
        // if (authCode){
        //     // axios를 사용하여 백엔드에 인증 코드 전달
        //     axios.post(`${process.env.APP}/auth/google`)
        // }
    }
}
</script>

<style lang="scss" scoped>

</style>