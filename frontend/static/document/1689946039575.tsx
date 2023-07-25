import React from "react";
import * as ReactDOM from "react-dom";
import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  getByLabelText,
  queryByText,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { render } from "../test_Util/testing_repeat_code";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Profile from "../pages/Profile1";
import { getByTestId, waitFor,screen } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import Modal from "react"
import { mount, shallow } from 'enzyme';

const data = {
  success: true,
  employeeData: [
    {
      basic: {
        name: {
          firstName: "Prapti",
          middleName: "Anil",
          lastName: "Gomekar",
        },

        mobile: {
          countryCode: "+91",
          number: 9860234523,
        },
        selectCount: 0,
        employeeId: "UISPL0004",
        gender: "Female",
        dateOfJoining:
          "Sun Feb 13 2022 05:30:00 GMT+0530 (India Standard Time)",
        maritalStatus: "SINGLE",
        probationPeriod: 3,
        confirmationDate: "2022-05-12T18:30:00.000Z",
        dateOfBirth: "2000-11-18T00:00:00.000Z",
        employmentStatus: "active",
        employmentType: "FTE",
        designation: "JUNIOR SOFTWARE ENGINEER",
        department: "SOFTWARE DEVELOPMENT",
        workMode: "WFH",
        workLocation: "Pune",
        selfDeclaration: {
          idProofs: {
            bloodGroup: "B-Positive",
            aadhaarCard: {
              aadhaarNumber: 673465324246,
              verifyStatus: "Pending",
              uploadedAt: "2023-04-13T13:30:19.872Z",
            },
            panCard: {
              panCardNumber: "AYRPP0909Q",
              verifyStatus: "Pending",
              uploadedAt: "2023-04-13T13:30:19.872Z",
            },
            passport: {
              verifyStatus: "Pending",
              uploadedAt: "2023-04-13T13:30:19.872Z",
            },
          },
          academics: [],
          previousCompany: [],
        },
        email: "praptig@uvxcel.com",
      },
      payrollData: {
        updatedby: {
          empId: "UISPL0005",
          date: "2023-04-13T14:23:06.648Z",
        },
        createdby: {
          empId: "UISPL0001",
          date: "2023-04-13T13:49:48.759Z",
        },
        _id: "6438042c1ed10be60f9d952a",
        empId: "UISPL0004",
        __v: 0,
        DOB3: "1966-06-06",
        DOB4: "1970-07-08",
        NameofFather: "Anil Gomekar",
        NameofMother: "Savita Gomekar",
        numberOfMember: 2,
        role: "technicalEmployee",
        empStatus: "Confirmed",
      },
    },
    {
      basic: {
        name: {
          firstName: "Pratik ",
          middleName: "Dilip",
          lastName: "Raut",
        },
        mobile: {
          countryCode: "+91",
          number: 9867456786,
        },
        selectCount: 0,
        employeeId: "UISPL0006",
        gender: "Male",
        dateOfJoining:
          "Thu Apr 13 2023 05:30:00 GMT+0530 (India Standard Time)",
        maritalStatus: "SINGLE",
        probationPeriod: 3,
        confirmationDate: "2023-07-12T18:30:00.000Z",
        dateOfBirth: "1998-12-28T00:00:00.000Z",
        employmentStatus: "active",
        employmentType: "FTE",
        designation: "JUNIOR ACCOUNTANT ",
        department: "ACCOUNT",
        workMode: "WFH",
        workLocation: "Pune",
        selfDeclaration: {
          idProofs: {
            bloodGroup: "B-Positive",
            aadhaarCard: {
              aadhaarNumber: 234356787898,
              verifyStatus: "Pending",
              uploadedAt: "2023-04-14T09:15:59.565Z",
            },
            panCard: {
              panCardNumber: "AYRPT5567Y",
              verifyStatus: "Pending",
              uploadedAt: "2023-04-14T09:15:59.565Z",
            },
            passport: {
              verifyStatus: "Pending",
              uploadedAt: "2023-04-14T09:15:59.565Z",
            },
          },
          academics: [],
          previousCompany: [],
        },
        email: "pratikr@uvxcel.com",
      },
      payrollData: {
        empStatus: "Pending",
        _id: "643919e12a78b7517d0510db",
        empId: "UISPL0006",
        DOB3: "1968-12-09",
        DOB4: "1970-03-08",
        NameofFather: "Dilip Raut",
        NameofMother: "ABC",
        numberOfMember: 3,
        role: "technicalEmployee",
      },
    },
  ],
};
const ctcData = {
  "success": true,
  "employeeCTC": {
      "_id": "6438106147885c4332e8f732",
      "Emp_Id": "UISPL0004",
      "CTC": "900000",
      "__v": 0
  }
}

const monthData = {
  "success": true,
  "finalData": {
      "May2023": {
          "present": 0,
          "sick leave": 0,
          "casual leave": 0,
          "privilege leave": 0,
          "holiday": 0,
          "totalBusinessDay": 23
      }
  }
}

const singlePfData = {
  "updatedby": {
      "empId": "UISPL0002",
      "date": "2023-04-19T09:56:58.878Z"
  },
  "createdby": {
      "empId": "UISPL0002",
      "date": "2023-04-13T12:48:11.559Z"
  },
  "_id": "64380b8d6a184d03adc85af0",
  "empId": "UISPL0004",
  "__v": 0,
  "aadharNumber": 673465324246,
  "accountNumber": 23459178357,
  "address": "Amravati",
  "bankName": "Kotak Mahindra",
  "dateofRegistration": "2023-04-03",
  "empDob": "2001-04-16",
  "ifscCode": "bkhg1234567",
  "name": "Prapti Gomekar",
  "panNumber": "AYRPP0909Q",
  "pfStatus": "Active",
  "pfUanNumber": 98767891656
}

// For testing creating fake api to return fake data for testing purpose
//Here creating server
const server = setupServer();

const customeServerCall = () => {
  return server.use(
    rest.get("/api/v2/payroll/user/all", (req, res, ctx) => {
      return res(ctx.json(data));
    })
  );
};

//Creating Server for CTC
const ctcServerCall = () => {
  return server.use(
    rest.get("/api/v2/payroll/user/ctc", (req, res, ctx) => {
      return res(ctx.json(ctcData));
    })
  );
};

//Creating Server for Month and Year data
const monthYearServerCall = () => {
  return server.use(
    rest.get("/api/v2/user/data", (req, res, ctx) => {
      return res(ctx.json(monthData));
    })
  );
};

//Creating Server for Month and Year data
const singlePfServerCall = () => {
  return server.use(
    rest.get("/api/v2/single-pfemp/UISPL0004", (req, res, ctx) => {
      return res(ctx.json(singlePfData));
    })
  );
};

describe("empConfirm.test.tsx", () => {
  //Run sever
  beforeAll(() => {
    server.listen();
  });
  //Reset server
  afterEach(() => server.resetHandlers());
  //Stop server
  afterAll(() => server.close());
  //First test case
  it("component should render", async () => {
    //Calling custome server

    //customeServerCall();
    singlePfServerCall();
    server.use(
      rest.get("/api/v2/me", (req, res, ctx) => {
        return res(
          ctx.json(
            {
              "success": true,
              "employee": {
                  "basic": {
                      "name": {
                          "firstName": "Prapti",
                          "middleName": "Anil",
                          "lastName": "Gomekar"
                      },
                      "mobile": {
                          "countryCode": "+91",
                          "number": 9860234523
                      },
                      "selectCount": 0,
                      "employeeId": "UISPL0004",
                      "gender": "Female",
                      "dateOfJoining": "Sun Feb 13 2022 05:30:00 GMT+0530 (India Standard Time)",
                      "maritalStatus": "SINGLE",
                      "probationPeriod": 3,
                      "confirmationDate": "2022-05-12T18:30:00.000Z",
                      "dateOfBirth": "2000-11-18T00:00:00.000Z",
                      "employmentStatus": "active",
                      "employmentType": "FTE",
                      "designation": "JUNIOR SOFTWARE ENGINEER",
                      "department": "SOFTWARE DEVELOPMENT",
                      "workMode": "WFH",
                      "workLocation": "Pune",
                      "selfDeclaration": {
                          "idProofs": {
                              "bloodGroup": "B-Positive",
                              "aadhaarCard": {
                                  "aadhaarNumber": 673465324246,
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              },
                              "panCard": {
                                  "panCardNumber": "AYRPP0909Q",
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              },
                              "passport": {
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              }
                          },
                          "academics": [],
                          "previousCompany": []
                      },
                      "email": "praptig@uvxcel.com"
                  },
                  "payrollData": {
                      "updatedby": {
                          "empId": "UISPL0005",
                          "date": "2023-04-13T14:23:06.648Z"
                      },
                      "createdby": {
                          "empId": "UISPL0001",
                          "date": "2023-04-13T13:49:48.759Z"
                      },
                      "_id": "6438042c1ed10be60f9d952a",
                      "empId": "UISPL0004",
                      "__v": 0,
                      "DOB3": "1966-06-06",
                      "DOB4": "1970-07-08",
                      "NameofFather": "Anil Gomekar",
                      "NameofMother": "Savita Gomekar",
                      "numberOfMember": 2,
                      "role": "technicalEmployee",
                      "empStatus": "Confirmed",
                      "password": "$2a$10$pMVWSSG7LJcyLh5nwOGQvOv5HwfTLQ06mFX/g25JDvn2yZmnFVSQG"
                  }
              }
          }
          )
        );
      })
    );
    ctcServerCall();
    monthYearServerCall();

    // redering component here
    const { debug, findByText, queryAllByTestId } = render(<Profile />, {
      route: "/app/profile1",
    });
    //checking that text is present or not
    await findByText("UISPL0004");
    debug()
  });

  it("checking chekbox is working or not and the family information of an employee is displayed on modal or not.", async () => {
    //Calling custome server

    //customeServerCall();
    singlePfServerCall();
    server.use(
      rest.get("/api/v2/me", (req, res, ctx) => {
        return res(
          ctx.json(
            {
              "success": true,
              "employee": {
                  "basic": {
                      "name": {
                          "firstName": "Prapti",
                          "middleName": "Anil",
                          "lastName": "Gomekar"
                      },
                      "mobile": {
                          "countryCode": "+91",
                          "number": 9860234523
                      },
                      "selectCount": 0,
                      "employeeId": "UISPL0004",
                      "gender": "Female",
                      "dateOfJoining": "Sun Feb 13 2022 05:30:00 GMT+0530 (India Standard Time)",
                      "maritalStatus": "SINGLE",
                      "probationPeriod": 3,
                      "confirmationDate": "2022-05-12T18:30:00.000Z",
                      "dateOfBirth": "2000-11-18T00:00:00.000Z",
                      "employmentStatus": "active",
                      "employmentType": "FTE",
                      "designation": "JUNIOR SOFTWARE ENGINEER",
                      "department": "SOFTWARE DEVELOPMENT",
                      "workMode": "WFH",
                      "workLocation": "Pune",
                      "selfDeclaration": {
                          "idProofs": {
                              "bloodGroup": "B-Positive",
                              "aadhaarCard": {
                                  "aadhaarNumber": 673465324246,
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              },
                              "panCard": {
                                  "panCardNumber": "AYRPP0909Q",
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              },
                              "passport": {
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              }
                          },
                          "academics": [],
                          "previousCompany": []
                      },
                      "email": "praptig@uvxcel.com"
                  },
                  "payrollData": {
                      "updatedby": {
                          "empId": "UISPL0005",
                          "date": "2023-04-13T14:23:06.648Z"
                      },
                      "createdby": {
                          "empId": "UISPL0001",
                          "date": "2023-04-13T13:49:48.759Z"
                      },
                      "_id": "6438042c1ed10be60f9d952a",
                      "empId": "UISPL0004",
                      "__v": 0,
                      "DOB3": "1966-06-06",
                      "DOB4": "1970-07-08",
                      "NameofFather": "Anil Gomekar",
                      "NameofMother": "Savita Gomekar",
                      "numberOfMember": 2,
                      "role": "technicalEmployee",
                      "empStatus": "Confirmed",
                      "password": "$2a$10$pMVWSSG7LJcyLh5nwOGQvOv5HwfTLQ06mFX/g25JDvn2yZmnFVSQG"
                  }
              }
          }
          )
        );
      })
    );
    ctcServerCall();
    monthYearServerCall();

    // redering component here
    const { debug, findByText, queryAllByTestId,getByLabelText,getAllByTestId,container,queryByText } = render(<Profile />, {
      route: "/app/profile1",
    });
    //checking that text is present or not
    await findByText("Prapti Anil Gomekar");
    const checkbox = getAllByTestId("familyCheckbox")[0] as HTMLInputElement;
    
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  // const modal = container.querySelectorAll(".Modal");
  // expect(modal).toBeInTheDocument();

    //await waitFor(() => userEvent.click(familyCheckbox[0]));

    const familyInfoButton = getAllByTestId('famBtn')[0] as HTMLElement;
    expect(familyInfoButton).not.toHaveStyle("display: none");
    fireEvent.click(familyInfoButton);
    await findByText("Savita Gomekar");
    await findByText("Anil Gomekar");
    //await waitFor(() => expect(getAllByTestId('familyModal')).toBeInTheDocument());
    debug()
  });
  
  it("Checking the salary information of employee is displayed on modal or not.", async () => {
    //Calling custome server

    //customeServerCall();
    singlePfServerCall();
    server.use(
      rest.get("/api/v2/me", (req, res, ctx) => {
        return res(
          ctx.json(
            {
              "success": true,
              "employee": {
                  "basic": {
                      "name": {
                          "firstName": "Prapti",
                          "middleName": "Anil",
                          "lastName": "Gomekar"
                      },
                      "mobile": {
                          "countryCode": "+91",
                          "number": 9860234523
                      },
                      "selectCount": 0,
                      "employeeId": "UISPL0004",
                      "gender": "Female",
                      "dateOfJoining": "Sun Feb 13 2022 05:30:00 GMT+0530 (India Standard Time)",
                      "maritalStatus": "SINGLE",
                      "probationPeriod": 3,
                      "confirmationDate": "2022-05-12T18:30:00.000Z",
                      "dateOfBirth": "2000-11-18T00:00:00.000Z",
                      "employmentStatus": "active",
                      "employmentType": "FTE",
                      "designation": "JUNIOR SOFTWARE ENGINEER",
                      "department": "SOFTWARE DEVELOPMENT",
                      "workMode": "WFH",
                      "workLocation": "Pune",
                      "selfDeclaration": {
                          "idProofs": {
                              "bloodGroup": "B-Positive",
                              "aadhaarCard": {
                                  "aadhaarNumber": 673465324246,
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              },
                              "panCard": {
                                  "panCardNumber": "AYRPP0909Q",
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              },
                              "passport": {
                                  "verifyStatus": "Pending",
                                  "uploadedAt": "2023-04-13T13:30:19.872Z"
                              }
                          },
                          "academics": [],
                          "previousCompany": []
                      },
                      "email": "praptig@uvxcel.com"
                  },
                  "payrollData": {
                      "updatedby": {
                          "empId": "UISPL0005",
                          "date": "2023-04-13T14:23:06.648Z"
                      },
                      "createdby": {
                          "empId": "UISPL0001",
                          "date": "2023-04-13T13:49:48.759Z"
                      },
                      "_id": "6438042c1ed10be60f9d952a",
                      "empId": "UISPL0004",
                      "__v": 0,
                      "DOB3": "1966-06-06",
                      "DOB4": "1970-07-08",
                      "NameofFather": "Anil Gomekar",
                      "NameofMother": "Savita Gomekar",
                      "numberOfMember": 2,
                      "role": "technicalEmployee",
                      "empStatus": "Confirmed",
                      "password": "$2a$10$pMVWSSG7LJcyLh5nwOGQvOv5HwfTLQ06mFX/g25JDvn2yZmnFVSQG"
                  }
              }
          }
          )
        );
      })
    );
    ctcServerCall();
    monthYearServerCall();

    // redering component here
    const { debug, findByText, queryAllByTestId,getByLabelText,getAllByTestId,container,queryByText } = render(<Profile />, {
      route: "/app/profile1",
    });
    //checking that text is present or not
    await findByText("Prapti Anil Gomekar");
    const checkbox = getAllByTestId("salaryCheckbox")[0] as HTMLInputElement;
    
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();

    const salaryInfoButton = getAllByTestId('salaryBtn')[0] as HTMLElement;
    expect(salaryInfoButton).not.toHaveStyle("display: none");
     fireEvent.click(salaryInfoButton);
    await findByText("Last Month Salary Information");
    await findByText("Select month and year to download salary slip.");
    //await findByText("2023");

    const selectYear = getAllByTestId("selectYear")[0] as HTMLSelectElement
    const selectMonth = getAllByTestId("selectMonth")[0] as HTMLSelectElement
    // await waitFor(()=> userEvent.selectOptions(selectYear,"2022")) 
    // await waitFor(()=> userEvent.selectOptions(selectMonth,"April")) 
    // expect(selectYear.value).toBe('2022');
    // expect(selectMonth.value).toBe('3');
   // await findByText("Salary slip of April - 2022")

    //await waitFor(() => expect(getAllByTestId('familyModal')).toBeInTheDocument());
    debug()
  });
})






// describe("Employee profile  teste", () => {
//   let container: HTMLDivElement;

//   beforeEach(() => {
//     container = document.createElement("div");
//     document.body.appendChild(container);
//     ReactDOM.render(<Profile />, container);
//   });
//   test("should match the text", () => {
//     const text = screen.getByText("My profile");
//     expect(text).toBeInTheDocument();
//   });

//   test("checkbox should checked", () => {
//     //  const checkBox = container.querySelector("[data-test='check1']")as HTMLElement;
//     const check = screen.getByLabelText(
//       "Family Information"
//     ) as HTMLInputElement;
//     expect(check.checked).toEqual(false);
//     check.checked = true;
//     expect(check.checked).toEqual(true);
//   });

//   test("checkbox should checked using fireEvent", async () => {
//     const check = screen.getByLabelText(
//       "Family Information"
//     ) as HTMLInputElement;
//     // expect(screen.getByLabelText('Family Information')).toBeChecked()
//     fireEvent.change(check, { target: { checked: true } });
//     //userEvent.click(check);
//     expect(check.checked).toBe(true);
//   });

//   test("clicking on checkbox some style should change. ", async () => {
//     const { container } = render(<Profile />);
//     const checkbox = container.querySelector('.check1')as HTMLInputElement;
//     const element = container.querySelector('.familyHidden');
//     expect(element).toHaveStyle("display: table-cell;");
//     fireEvent.change(checkbox, { target: { checked: true } });
//     expect(checkbox.checked).toBe(true);
//     //expect(element).toHaveStyle('display: revert');
//     // expect(container.querySelector(".familyHidden")).toHaveStyle(
//     //   "display: table-cell"
//     // );
//   });
// });
