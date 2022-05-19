export class FileReaderStub {
    fileExists = jest.fn(() => true)
    readFileSync = jest.fn()

    enqueueData(data) {
        this.readFileSync = jest.fn(() => data)
    }

    enqueueFileExits(fileExists) {
        this.fileExists = jest.fn(() => fileExists)
    }
}
