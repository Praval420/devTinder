const  { SendEmailCommand } =require("@aws-sdk/client-ses");

const { sesClient } =require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "<h1>kaise ho mittr, badmoshi nhi</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "i am fine tell me something about yourself",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "checking",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "pravalraghuvanshi2004@gmail.com",
    "praval@devtinder.host",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};


module.exports= { run };