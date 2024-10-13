import LoginPage from "./LoginPage";
function Student_Login() {
  return (
    <div className="relative">
      
      <LoginPage role="student" loginEndpoint="studentlogin" signupEndpoint="studentsignup" redirectPath="/student" />

    </div>
  );
}

export default Student_Login;
