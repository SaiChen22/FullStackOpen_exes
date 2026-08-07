import {  useMutation } from "@apollo/client/react";
import { EDIT_AUTHOR,ALL_AUTHOR} from "../queries";

const SetBirthdayForm = ({ authors }) => {

    const [updateAuthor] = useMutation(EDIT_AUTHOR,{
        refetchQueries: [{ query: ALL_AUTHOR }]
    });


    const handleUpdateAuthor = (e) => {
      e.preventDefault();
      const form = e.target;
      const authorId = form.author.value;
      const born = form.born.value;

      updateAuthor({
        variables: {
          name: authorId,
          setBornTo: parseInt(born)
        }
      });
    };

  return (
    <div>
    <h3>Set birthyear</h3>
      <form onSubmit={handleUpdateAuthor}>
        <div>
          name
          <select name="author">
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
            born
            <input type="number" name="born" />
        </div>
        <div>
            <button type="submit">update author</button>
        </div>
      </form>
    </div>
  );
};

export default SetBirthdayForm;
