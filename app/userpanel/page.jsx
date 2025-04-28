"use client";
export default async function UserPanel() {
  const getMyData = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
    });
    const userData = await res.json();
    if (res.status === 200) {
      console.log(userData.data.name);
      console.log(userData.data.age);
    }
  };

  return (
    <div>
      <h1>USER PANEL</h1>
      <button onClick={getMyData}>Demo</button>
    </div>
  );
}
