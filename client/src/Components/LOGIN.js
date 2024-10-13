import LoginPage from "./LoginPage";
function LOGIN() {
  return (
    <div className="relative">
      
      <LoginPage role="Student" loginEndpoint="studentlogin" signupEndpoint="studentsignup" redirectPath="/student" />

    </div>
  );
}

export default LOGIN;
